import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProviderDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader><CardTitle>Claims Submission</CardTitle></CardHeader>
        <CardContent>Create and submit new claims with validation.</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Claims Tracking</CardTitle></CardHeader>
        <CardContent>Monitor statuses with real-time updates.</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Patient Directory</CardTitle></CardHeader>
        <CardContent>Search and view patient profiles.</CardContent>
      </Card>
    </div>
  )
}
