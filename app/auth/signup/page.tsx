"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({ nationalId: "", firstName: "", lastName: "", email: "", password: "", organizationName: "", role: "provider" })
  const [loading, setLoading] = useState(false)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [error, setError] = useState("")

  async function lookupNationalId(id: string) {
    if (!id) return
    setLookupLoading(true)
    try {
      const res = await fetch("/api/identity/lookup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nationalId: id }) })
      if (res.ok) {
        const data = await res.json()
        const d = data.data || {}
        setForm((f) => ({ ...f, firstName: d.firstName || f.firstName, lastName: d.lastName || f.lastName, email: d.email || f.email }))
      }
    } catch (err) {
      // ignore lookup errors - user can fill manually
    } finally {
      setLookupLoading(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    setLoading(false)
    if (res.ok) {
      router.push("/auth/signin")
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || "Signup failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 border rounded-lg p-6 bg-background">
        <h1 className="text-2xl font-semibold">Create account</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="space-y-2">
          <label htmlFor="nationalId" className="text-sm font-medium">National ID</label>
          <input id="nationalId" className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" value={form.nationalId} onChange={(e) => setForm({ ...form, nationalId: e.target.value })} onBlur={(e) => lookupNationalId(e.target.value)} required />
          {lookupLoading && <p className="text-xs text-muted-foreground">Looking up national registry...</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">First name</label>
            <input id="firstName" className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">Last name</label>
            <input id="lastName" className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" type="email" className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input id="password" type="password" className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <label htmlFor="organization" className="text-sm font-medium">Organization</label>
          <input id="organization" className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" value={form.organizationName} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium">Role</label>
          <select id="role" className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="admin">Admin</option>
            <option value="provider">Provider</option>
            <option value="insurer">Insurer</option>
            <option value="patient">Patient</option>
            <option value="government_official">Government</option>
          </select>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating..." : "Create account"}</Button>
        <p className="text-sm text-muted-foreground">Have an account? <Link className="underline" href="/auth/signin">Sign in</Link></p>
      </form>
    </div>
  )
}
