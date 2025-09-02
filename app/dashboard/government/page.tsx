import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function GovernmentDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader><CardTitle>Real-time Metrics</CardTitle></CardHeader>
        <CardContent>Population health indicators and KPIs.</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Outbreak Alerts</CardTitle></CardHeader>
        <CardContent>Geospatial monitoring and alerts.</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Policy Analytics</CardTitle></CardHeader>
        <CardContent>Evaluate impact and equity.</CardContent>
      </Card>
    </div>
  )
}
