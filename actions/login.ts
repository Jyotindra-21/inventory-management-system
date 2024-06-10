"use server"
import * as z from 'zod'
import { LoginSchema } from '@/schemas'
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_ROUTE } from '@/routes'
import { AuthError } from 'next-auth'
import { getUser } from '@/data/user'
import bcrypt from "bcryptjs"
import { db } from '@/lib/db'


export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values)
    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }
    const { username, password } = validatedFields.data
    const existingUser = await getUser(username)
    if (!existingUser) {
        return { error: "Username doesn't exist" }
    }

    try {
        await signIn("credentials", {
            username, password, redirectTo: DEFAULT_LOGIN_ROUTE

        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":

                    return { error: "Invalid credentials" }
                default:
                    return { error: "Something went wrong" }
            }
        }
        throw error;
    }
    return { success: "Email sent!" }
}