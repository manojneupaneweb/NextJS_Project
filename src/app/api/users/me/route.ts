import { connectDB } from "@/dbConfig/dbConnect";
import { getDataFromToken } from "@/helpers/getDataFromTokem";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        connectDB();
        const userId = await getDataFromToken(request);

        const user = await User.findById(userId).select('-password -__v');
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        return NextResponse.json({
            message: "User fetched successfully",
            user
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
    }
}