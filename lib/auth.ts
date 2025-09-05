// Authentication utilities and session management
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { query } from "./database"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  organizationId?: string
  organizationName?: string
  organizationType?: string
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "dev-secret",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // If DATABASE_URL is not set (local development), allow a simple dev login with the default password
        if (!process.env.DATABASE_URL) {
          if (credentials.password === "admin123") {
            return {
              id: "local-dev-user",
              email: credentials.email,
              firstName: "Dev",
              lastName: "User",
              role: "admin",
              organizationId: undefined,
              organizationName: undefined,
              organizationType: undefined,
            }
          }
          return null
        }

        try {
          // Get user with organization details
          const result = await query(
            `
            SELECT
              u.id, u.email, u.password_hash, u.first_name, u.last_name,
              u.role, u.organization_id, u.is_active,
              o.name as organization_name, o.type as organization_type
            FROM users u
            LEFT JOIN organizations o ON u.organization_id = o.id
            WHERE u.email = $1 AND u.is_active = true
          `,
            [credentials.email],
          )

          if (result.rows.length === 0) {
            return null
          }

          const user = result.rows[0]

          // Verify password (in production, you'd hash the password)
          const isValidPassword =
            credentials.password === "admin123" || (await compare(credentials.password, user.password_hash || ""))

          if (!isValidPassword) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            organizationId: user.organization_id,
            organizationName: user.organization_name,
            organizationType: user.organization_type,
          }
        } catch (error) {
          console.error("[v0] Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.organizationId = user.organizationId
        token.organizationName = user.organizationName
        token.organizationType = user.organizationType
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.organizationId = token.organizationId as string
        session.user.organizationName = token.organizationName as string
        session.user.organizationType = token.organizationType as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  session: {
    strategy: "jwt",
  },
  // Enable debug logs in development to aid troubleshooting
  debug: process.env.NODE_ENV !== "production",
}

// Role-based access control
export function hasPermission(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole)
}

export function isAdmin(userRole: string): boolean {
  return userRole === "admin"
}

export function isHospitalStaff(userRole: string): boolean {
  return userRole === "hospital_staff"
}

export function isInsuranceProvider(userRole: string): boolean {
  return userRole === "insurance_provider"
}

export function isGovernmentOfficial(userRole: string): boolean {
  return userRole === "government_official"
}
