import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = z.object({
    dealershipName: z.string().min(2, 'Dealership name is required'),
    name: z.string().min(2, 'Your name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string()
        .regex(/^[6-9]\d{9}$/, 'Enter valid Indian phone number (10 digits)'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Must contain at least one number'),
})

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
