import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import { hash } from "bcryptjs"

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Disabled in production" }, { status: 403 })
  }

  try {
    await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`)

    await query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT UNIQUE NOT NULL,
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

    const org = await query(
      `INSERT INTO organizations (name, type)
       VALUES ($1, $2)
       ON CONFLICT (name) DO UPDATE SET type = EXCLUDED.type
       RETURNING id`,
      ["Ministry of Health", "government"]
    )

    const adminHash = await hash("admin123", 10)

    await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, organization_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO NOTHING`,
      ["admin@example.com", adminHash, "Admin", "User", "admin", org.rows[0].id]
    )

    return NextResponse.json({ ok: true, email: "admin@example.com", password: "admin123" })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Seed failed" }, { status: 500 })
  }
}
