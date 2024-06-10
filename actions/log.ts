"use server"

import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";


export const logger = async (username: string, role: UserRole, action: string, name: string, quantity: number) => {
    try {
        await db.log.create({
            data: {
                username,
                role,
                action,
                name,
                quantity
            }
        })
        return true;
    } catch (error: any) {
        throw error
    }
}