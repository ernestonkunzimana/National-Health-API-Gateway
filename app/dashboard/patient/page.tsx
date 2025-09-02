import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PatientDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader><CardTitle>My Insurance</CardTitle></CardHeader>
        <CardContent>View coverage, digital card, benefits.</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>My Claims</CardTitle></CardHeader>
        <CardContent>Track submissions and statuses.</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Appointments</CardTitle></CardHeader>
        <CardContent>Book and manage appointments.</CardContent>
      </Card>
    </div>
  )
}
