import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import { hash } from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    let { nationalId, email, password, firstName, lastName, role = "provider", organizationName = "Default Organization", organizationType = "hospital" } = body

    // nationalId is required for identity verification
    if (!nationalId) {
      return NextResponse.json({ error: "nationalId is required" }, { status: 400 })
    }

    // If nationalId is provided but personal details are missing, attempt lookup
    if ((!firstName || !lastName || !email) && process.env.NATIONAL_ID_API_URL) {
      try {
        const res = await fetch(process.env.NATIONAL_ID_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nationalId }),
        })
        if (res.ok) {
          const data = await res.json()
          firstName = firstName || data.firstName
          lastName = lastName || data.lastName
          email = email || data.email
        }
      } catch (err) {
        console.warn("[signup] national ID lookup failed", err)
      }
    }

    // If still missing required fields, but DATABASE_URL missing (dev), allow simulation
    if (!firstName || !lastName || !email) {
      if (!process.env.DATABASE_URL) {
        // simulate fields based on nationalId
        firstName = firstName || "Dev"
        lastName = lastName || `User-${nationalId.slice(-4)}`
        email = email || `user+${nationalId.slice(-6)}@example.com`
      } else {
        return NextResponse.json({ error: "Missing required fields after identity lookup" }, { status: 400 })
      }
    }

    if (!password) {
      return NextResponse.json({ error: "Missing password" }, { status: 400 })
    }

    // If DATABASE_URL is not configured (development), skip DB operations and return a success response
    if (!process.env.DATABASE_URL) {
      console.warn("[signup] DATABASE_URL not set - skipping database operations in development mode")
      return NextResponse.json({ ok: true, warning: "No DATABASE_URL configured; signup simulated in development" })
    }

    // Ensure tables exist (idempotent)
    await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`)

    await query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        national_id TEXT UNIQUE,
        password_hash TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        role TEXT NOT NULL,
        organization_id UUID REFERENCES organizations(id),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    // Upsert organization
    const orgRes = await query(
      `INSERT INTO organizations (name, type)
       VALUES ($1, $2)
       ON CONFLICT (name) DO UPDATE SET type = EXCLUDED.type
       RETURNING id`,
      [organizationName, organizationType]
    )
    const organizationId = orgRes.rows[0].id

    // Hash password
    const passwordHash = await hash(password, 10)

    // Insert user
    await query(
      `INSERT INTO users (email, national_id, password_hash, first_name, last_name, role, organization_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [email, nationalId, passwordHash, firstName, lastName, role, organizationId]
    )

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("[signup] error", err)
    return NextResponse.json({ error: err?.message || "Signup failed" }, { status: 500 })
  }
}
