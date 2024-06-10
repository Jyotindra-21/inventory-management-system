import { db } from "@/lib/db";

export const getUser = async (username: string) => {
    try {
        const user = await db.user.findFirst({
            where: {
                username
            }
        })

        return user
    }
    catch {
        return null;
    }
}

export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: {
                id: id,
            }
        })
        return user;
    }
    catch {
        return null;
    }
}