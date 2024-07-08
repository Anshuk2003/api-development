import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export const validateJWT = async (request) => {
    try {
        const cookies = request.headers.get('cookie');
        if (!cookies) {
            return NextResponse.json({ message: 'Token not found' }, { status: 404 })
        }

        const parsedCookies = cookie.parse(cookies);
        const currentToken = parsedCookies.token;
        // console.log(currentToken)
        if (!currentToken) {
            return NextResponse.json({ message: 'Token not found' }, { status: 404 })
        }

        const decodedData = jwt.verify(currentToken, process.env.JWT_SECRETE);
        return decodedData.email;
    } catch (error) {
        //console.error("JWT validation error: ", error);
        return NextResponse.json({ message: 'JWT validation error: invalid token' }, { status: 500 })
    }
};
