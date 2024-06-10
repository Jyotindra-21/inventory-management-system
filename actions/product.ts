"use server"

import { db } from "@/lib/db"
import { AddProductSchema, EditProductSchema } from "@/schemas"
import { UserRole } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { logger } from "./log"
import { backendClient } from "@/lib/edgestore-server"


export const AddProducts = async (values: z.infer<typeof AddProductSchema>, username: string, role: UserRole) => {
    // Safely parse the values with schema
    const validatedFields = AddProductSchema.safeParse(values)
    // Return error if any invalid data
    if (!validatedFields.success) return { error: "Invalid fields" }
    try {
        if (process.env.CREATE_INVENTORY_ACTION) {

            // Check if name already exists
            const nameExists = await db.inventory.findFirst({ where: { name: validatedFields.data.name } })
            if (nameExists) return { error: "Product with same name already exists" }

            // Create the product
            await db.inventory.create({ data: validatedFields.data })

            // Log the create action
            await logger(username, role, process.env.CREATE_INVENTORY_ACTION, validatedFields.data.name, validatedFields.data.stock)
            revalidatePath("/")
            return { success: "Inventory created successfully!" }
        }
        return { error: "Add action doesn't exist in env" }
    } catch (error: any) {
        // Send user friend errors in simple manner
        console.log(error)
        return { error: error.message }
    }
}


export const editProducts = async (values: z.infer<typeof EditProductSchema>, username: string, role: UserRole) => {
    // Validate the schema
    const validatedFields = EditProductSchema.safeParse(values);

    // Return error if any invalid data
    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    const validated = validatedFields.data;
    try {
        // Check if Id exists
        const idExists = await db.inventory.findFirst({ where: { id: validated.id } });
        if (!idExists) {
            return { error: "Id not found" }
        }
        if (validatedFields.data.image !== idExists.image) {
            const res = await backendClient.publicFiles.deleteFile({
                url: idExists.image,
            });
        }
        await db.inventory.update({
            data: {
                name: validated.name,
                stock: validated.stock,
                minStock: validated.minStock,
                image: validated.image
            },
            where: {
                id: validated.id
            }
        })
        // Log the updates
        await logger(username, role, process.env.UPDATED_INVENTORY_ACTION!, validated.name, validated.stock)
        revalidatePath("/")
        return { success: "Inventory updated" }

    } catch (error: any) {
        // Send user friend errors in simple manner
        console.error(error);
        return { error: error.message }
    }
};