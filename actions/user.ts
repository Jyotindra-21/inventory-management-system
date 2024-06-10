
"use server"
import { getUser } from "@/data/user"
import { db } from "@/lib/db"
import { RegisterSchema } from "@/schemas"
import { UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export const CreateUser = async (userCreds: z.infer<typeof RegisterSchema>) => {

    const validatedFields = RegisterSchema.safeParse(userCreds)
    if (!validatedFields.success) return { error: "Invalid fields" }
    try {
        const existingUser = await getUser(validatedFields.data.username)
        if (existingUser) {
            return { error: "User already exists" }
        }
        // Hash the password 
        const salt = "$2a$10$dbJN/Kuz9N7K2YGtWsIjyO"

        const hashedPassword = await bcrypt.hash(validatedFields.data.password, salt);
        // Add row in the database
        await db.user.create({
            data: {
                username: validatedFields.data.username,
                password: hashedPassword,
                role: validatedFields.data.role
            }
        })
        revalidatePath("/users")
        return { success: "User created successfully" }
    } catch (error) {
        return { error: "Something went wrong" }
    }
}



export const updateUserPassword = async (id: string, password: string) => {
    try {
        // Check if id exists otherwise return an error
        const idExists = await db.user.findFirst({ where: { id } })

        if (!idExists) return { error: "User not found" }
        // // Hash the password 
        const salt = "$2a$10$dbJN/Kuz9N7K2YGtWsIjyO"
        // // Generate the salt and hash the new password
        const hashedPassword = await bcrypt.hash(password, salt);

        // // Update the hash and return success message
        await db.user.update({
            data: {
                password: hashedPassword
            },
            where: {
                id
            }
        })
        // revalidate the path
        revalidatePath("/")

        return { success: "User password successfully" }

    } catch (error: any) {
        console.log(error)
        return { error: error.message }

    }
}

