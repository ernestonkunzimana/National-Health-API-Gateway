import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader><CardTitle>User Management</CardTitle></CardHeader>
        <CardContent>Invite users, assign roles, review access.</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>System Settings</CardTitle></CardHeader>
        <CardContent>Configure tenants, API keys, quotas.</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Audit Logs</CardTitle></CardHeader>
        <CardContent>Track critical actions and events.</CardContent>
      </Card>
    </div>
  )
}
