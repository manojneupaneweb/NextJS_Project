import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";


export const getDataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get('token')?.value || '';

        const decoded:any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);

        return decoded.id;
    } catch (error) {
        return null;
    }
};