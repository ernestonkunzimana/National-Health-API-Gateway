"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function SignOutButton() {
  return (
    <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })} className="cursor-pointer">
      Sign out
    </Button>
  )
}
