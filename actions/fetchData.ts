"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export const getUsers = async () => {
    try {
        const users = await db.user.findMany({
            orderBy: {
                createdAt: 'asc' // Assuming createdAt is the date field
            }
        });
        revalidatePath("/");
        return users;
    } catch (error) {
        return { error: "Cannot fetch the users" };
    }
};


export const getInventories = async () => {
    try {
        const inventories = await db.inventory.findMany({
            orderBy: {
                createdAt: 'asc'
            }
        });
        revalidatePath("/");
        return inventories;
    } catch (error) {
        return { error: "Cannot fetch the inventories" };
    }
};



export const getLogs = async () => {
    try {
        const logs = await db.log.findMany({
            orderBy: {
                createdAt: 'asc'
            }
        });
        revalidatePath("/");
        return logs;
    } catch (error) {
        return { error: "Cannot fetch the logs" };
    }
};


export const getInventoryById = async (id: string) => {
    try {
        const inventory = await db.inventory.findFirst({ where: { id } })
        if (!inventory) return { error: "Id doesn't exist" }
        revalidatePath("/")
        return inventory;
    } catch (error) {
        return { error: "Cannot fetch the inventory" };

    }
}