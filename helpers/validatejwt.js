// import jwt from "jsonwebtoken"
 import { NextResponse } from "next/server";

// export const validateJWT = async (request) => {
//     try {
//         console.log(request.cookies);
//         const currenttoken = request.cookies.get("token")?.value;
//         console.log(currenttoken)
//         if (currenttoken) {
//             const decodedata = await jwt.verify(currenttoken, process.env.JWT_SECRETE);
//             return decodedata.email;
//         }
//         return NextResponse.json({ message: 'Token not found' }, { status: 404 })
//     } catch (error) {
//         return new Error(error.message);
//     }
// }
import jwt from "jsonwebtoken";
import cookie from "cookie";

export const validateJWT = async (request) => {
    try {
        const cookies = request.headers.get('cookie');
        if (!cookies) {
            return NextResponse.json({ message: 'cookies not found' }, { status: 404 })
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
