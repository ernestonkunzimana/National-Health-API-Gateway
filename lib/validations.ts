// Data validation schemas using Zod
import { z } from "zod"

// User validation schemas
export const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional(),
  role: z.enum(["admin", "hospital_staff", "insurance_provider", "government_official", "patient"]),
  organizationId: z.string().uuid().optional(),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = userSchema
  .extend({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

// Patient validation schema
export const patientSchema = z.object({
  nationalId: z.string().min(16, "National ID must be 16 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
  gender: z.enum(["male", "female", "other"]),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  insuranceNumber: z.string().min(1, "Insurance number is required"),
  insuranceProviderId: z.string().uuid("Invalid insurance provider"),
})

// Claim validation schema
export const claimSchema = z.object({
  patientId: z.string().uuid("Invalid patient ID"),
  providerId: z.string().uuid("Invalid provider ID"),
  insuranceProviderId: z.string().uuid("Invalid insurance provider ID"),
  claimType: z.enum(["inpatient", "outpatient", "pharmacy", "laboratory", "emergency"]),
  diagnosisCode: z.string().optional(),
  diagnosisDescription: z.string().min(1, "Diagnosis description is required"),
  treatmentDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid treatment date"),
  totalAmount: z.number().positive("Total amount must be positive"),
  items: z
    .array(
      z.object({
        serviceCode: z.string().optional(),
        serviceDescription: z.string().min(1, "Service description is required"),
        quantity: z.number().int().positive("Quantity must be positive"),
        unitPrice: z.number().positive("Unit price must be positive"),
        totalPrice: z.number().positive("Total price must be positive"),
      }),
    )
    .min(1, "At least one claim item is required"),
})

// Organization validation schema
export const organizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  type: z.enum(["hospital", "insurance_company", "government_agency", "clinic", "pharmacy", "laboratory"]),
  licenseNumber: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  contactPerson: z.string().optional(),
})

// API response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})

export type UserInput = z.infer<typeof userSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type PatientInput = z.infer<typeof patientSchema>
export type ClaimInput = z.infer<typeof claimSchema>
export type OrganizationInput = z.infer<typeof organizationSchema>
export type ApiResponse = z.infer<typeof apiResponseSchema>
