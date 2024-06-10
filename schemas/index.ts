import { UserRole } from '@prisma/client'
import * as z from 'zod'

// Declare roles
export const roles = ["manager", "fitter"] as const

// Login schema (username and password) * required
export const LoginSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    })
})

// Register schema (username, password and role) * required
export const RegisterSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    }),
    role: z.enum(roles)
})

export const AddProductSchema = z.object({
    name: z.string({ required_error: "name is required" }).min(1, { message: "name is required" }),
    image: z.string(),
    stock: z.preprocess((val) => parseInt(z.string().parse(val), 10), z.number().min(1)),
    minStock: z.preprocess((val) => parseInt(z.string().parse(val), 10), z.number().min(1))
});

export const EditProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    stock: z.preprocess((val) => parseInt(z.string().parse(val), 10), z.number().min(1)),
    minStock: z.preprocess((val) => parseInt(z.string().parse(val), 10), z.number().min(1)),
    image: z.string()
});
