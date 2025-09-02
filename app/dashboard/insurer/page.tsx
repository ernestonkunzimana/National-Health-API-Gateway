import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function InsurerDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader><CardTitle>Claims Adjudication</CardTitle></CardHeader>
        <CardContent>Review, approve, or reject claims.</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Fraud Alerts</CardTitle></CardHeader>
        <CardContent>Investigate anomalies and risks.</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Payments</CardTitle></CardHeader>
        <CardContent>Track disbursements and settlements.</CardContent>
      </Card>
    </div>
  )
}
