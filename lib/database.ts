// Database connection and query utilities
import { Pool } from "pg"

// Database connection pool
let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || "postgresql://localhost:5432/rwanda_healthlink",
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  return pool
}

// Generic query function with error handling
export async function query(text: string, params?: any[]) {
  const pool = getPool()
  const start = Date.now()

  try {
    const result = await pool.query(text, params)
    const duration = Date.now() - start

    console.log("[v0] Database query executed", {
      query: text.substring(0, 100) + "...",
      duration: `${duration}ms`,
      rows: result.rowCount,
    })

    return result
  } catch (error) {
    console.error("[v0] Database query error:", error)
    throw error
  }
}

// Transaction helper
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const pool = getPool()
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

// Health check function
export async function healthCheck(): Promise<boolean> {
  try {
    const result = await query("SELECT 1 as health")
    return result.rows.length > 0
  } catch (error) {
    console.error("[v0] Database health check failed:", error)
    return false
  }
}
