"use server"

import { db } from "@/lib/db"
import { backendClient } from "@/lib/edgestore-server"
import { UserRole } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { logger } from "./log"


export const deleteUser = async (id: string) => {
    try {
        const idExists = await db.user.findFirst({ where: { id } })
        if (!idExists) return { error: "Invalid id" }
        const countUsers = await db.user.count()
        if (countUsers === 1) {
            return { error: "Cannot delete the last user" }
        }
        await db.user.delete({ where: { id } })
        revalidatePath("/")
        return { success: "User deleted successfully" }
    } catch (error: any) {
        console.log(error)
        return { error: "Cannot delete the user" }
    }
}


export const deleteInventory = async (id: string, username: string, role: UserRole) => {
    try {
        if (process.env.DELETE_INVENTORY_ACTION) {
            const idExists = await db.inventory.findFirst({ where: { id } })
            if (!idExists) return { error: "Invalid id" }
            const res = await backendClient.publicFiles.deleteFile({
                url: idExists.image,
            });
            await logger(username, role, process.env.DELETE_INVENTORY_ACTION, idExists.name, idExists.stock)

            await db.inventory.delete({ where: { id } })
            revalidatePath("/")
            return { success: "Inventory deleted successfully" }
        }
    } catch (error: any) {
        console.log(error)
        return { error: "Cannot delete the inventory" }
    }
}