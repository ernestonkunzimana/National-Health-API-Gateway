import type { ReactNode } from "react"
import dynamic from "next/dynamic"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

// Load the sign-out button as a client-only component to avoid importing client code on the server
const SignOutButton = dynamic(() => import("@/components/sign-out-button").then((m) => m.SignOutButton), {
  ssr: false,
})

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/signin")

  return (
    <div className="min-h-screen">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="font-semibold">Dashboard</div>
          <div className="text-sm">{session.user.firstName} {session.user.lastName} · {session.user.role}</div>
          <SignOutButton />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
