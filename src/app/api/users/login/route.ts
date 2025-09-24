import { connectDB } from "@/dbConfig/dbConnect";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { email, password } = await request.json();

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return NextResponse.json({ message: "User not found " }, { status: 400 });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
        }

        const tokenData = {
            id: existingUser._id,
            email: existingUser.email,
            username: existingUser.username
        }

        const token = await jwt.sign(
            tokenData,
            process.env.ACCESS_TOKEN_SECRET!,
            {
                expiresIn: '1d'
            }
        );


        const response = NextResponse.json(
            {
                message: "Login successful",
                success: true,
            }
        );

        response.cookies.set('token', token,
            {
                httpOnly: true,
            }
        )

        return response;


    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
