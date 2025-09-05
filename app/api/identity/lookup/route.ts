import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nationalId } = body
    if (!nationalId) return NextResponse.json({ error: "nationalId required" }, { status: 400 })

    // If a real NATIONAL_ID_API_URL is configured, proxy the request there
    const apiUrl = process.env.NATIONAL_ID_API_URL
    if (apiUrl) {
      try {
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nationalId }),
        })
        if (!res.ok) return NextResponse.json({ error: "external lookup failed" }, { status: 502 })
        const data = await res.json()
        return NextResponse.json({ ok: true, data })
      } catch (err: any) {
        console.error("[identity.lookup] external lookup error", err)
        return NextResponse.json({ error: "external lookup error" }, { status: 502 })
      }
    }

    // Development fallback: simulate a lookup by deriving values from the nationalId
    const simulated = {
      firstName: "John",
      lastName: `Citizen-${nationalId.slice(-4)}`,
      email: `user+${nationalId.slice(-6)}@example.com`,
    }

    return NextResponse.json({ ok: true, data: simulated })
  } catch (err: any) {
    console.error("[identity.lookup] error", err)
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 })
  }
}
