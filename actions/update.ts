"use server"

import { db } from "@/lib/db"
import { sendMail } from "@/lib/resend"
import { UserRole } from "@prisma/client"
import { revalidatePath } from "next/cache"

export const addStock = async (id: string, stock: number, username: string, role: UserRole) => {
    try {
        const existingStock: any = await db.inventory.findFirst({ where: { id } })
        const updatedStock = await db.inventory.update({
            data: {
                stock: stock + existingStock?.stock
            },
            where: {
                id: id
            }
        })
        await db.log.create({
            data: {
                name: existingStock.name,
                username: username,
                role: role,
                quantity: stock,
                action: process.env.ADD_INVENTORY_ACTION!,

            }
        })
        revalidatePath("/")
        return { success: "Stock updated" }
    } catch (error: any) {
        return { error: error.message }
    }

}




export const removeStock = async (id: string, stock: number, username: string, role: UserRole) => {
    try {
        const existingStock: any = await db.inventory.findFirst({ where: { id } })
        if (existingStock?.stock - stock < 0) {
            return { error: "Stock value cannot be less than 0" }
        }
        if (existingStock?.stock - stock <= existingStock?.minStock) {
            await sendMail(existingStock.name, existingStock?.stock - stock)
            console.log("Stock is low")
        }
        await db.inventory.update({
            data: {
                stock: existingStock?.stock - stock
            },
            where: {
                id: id
            }
        })
        await db.log.create({
            data: {
                name: existingStock.name,
                username: username,
                role: role,
                quantity: stock,
                action: process.env.REMOVE_INVENTORY_ACTION!,

            }
        })
        revalidatePath("/")
        return { success: "Stock updated" }
    } catch (error: any) {
        return { error: error.message }
    }

}