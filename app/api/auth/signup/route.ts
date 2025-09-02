import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import { hash } from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, firstName, lastName, role = "provider", organizationName = "Default Organization", organizationType = "hospital" } = body

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Ensure tables exist (idempotent)
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
      `INSERT INTO users (email, password_hash, first_name, last_name, role, organization_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [email, passwordHash, firstName, lastName, role, organizationId]
    )

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("[signup] error", err)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
