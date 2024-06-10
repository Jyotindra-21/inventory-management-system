import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const allUsers = await db.user.findMany()
        return Response.json(allUsers)
    } catch (error) {
        console.log(error);

    }
}