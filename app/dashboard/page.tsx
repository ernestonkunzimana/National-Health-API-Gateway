import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardHome() {
  const session = await getServerSession(authOptions)
  const role = session?.user.role || "provider"

  const links = [
    { href: "/dashboard/admin", title: "Admin Console", roles: ["admin"] },
    { href: "/dashboard/provider", title: "Provider Dashboard", roles: ["provider", "hospital_staff"] },
    { href: "/dashboard/insurer", title: "Insurer Dashboard", roles: ["insurer", "insurance_provider"] },
    { href: "/dashboard/patient", title: "Patient Dashboard", roles: ["patient"] },
    { href: "/dashboard/government", title: "Government Dashboard", roles: ["government_official"] },
  ].filter((l) => l.roles.includes(role))

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {links.map((l) => (
        <Card key={l.href} className="hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>{l.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={l.href} className="text-primary underline">Open</Link>
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2">
            <li>Total Claims: 0</li>
            <li>Pending Approvals: 0</li>
            <li>Notifications: 0</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
