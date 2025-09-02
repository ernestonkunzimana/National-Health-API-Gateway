declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      role: string
      organizationId?: string
      organizationName?: string
      organizationType?: string
    }
  }

  interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    organizationId?: string
    organizationName?: string
    organizationType?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    organizationId?: string
    organizationName?: string
    organizationType?: string
    firstName: string
    lastName: string
  }
}
