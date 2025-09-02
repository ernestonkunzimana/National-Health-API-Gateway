import type { ReactNode } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

function SignOutButton() {
  "use client"
  import { signOut } from "next-auth/react"
  return (
    <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })} className="cursor-pointer">Sign out</Button>
  )
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/signin")

  return (
    <div className="min-h-screen">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="font-semibold">Dashboard</div>
          <div className="text-sm">{session.user.firstName} {session.user.lastName} · {session.user.role}</div>
          {/* @ts-expect-error: client component inline */}
          <SignOutButton />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
