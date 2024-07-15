import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { getSession } from "next-auth/react";
import connectdb from "../../config/dbconfig";

export const validateJWT = async (request,res) => {
    try {
        const cookies = request.headers.get('cookie');
        if (!cookies) {
            return NextResponse.json({ message: 'Token not found' }, { status: 404 })
        }

        const parsedCookies = cookie.parse(cookies);
        if(parsedCookies.token){
            const currentToken = parsedCookies.token
            if (!currentToken) {
                return NextResponse.json({ message: 'Token not found' }, { status: 404 })
            }
    
            const decodedData = jwt.verify(currentToken, process.env.JWT_SECRETE);
            return decodedData.email;
        }



  const accessToken = parsedCookies.access_token;

  // Validate the token with Google
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
  );

  if (!response.ok) {
    return NextResponse.json({ message: "Invalid token" },{status:401});
  }

  const data = await response.json();
  // Check for required scopes or any other validation
  if (!data.audience || data.audience !== process.env.GOOGLE_CLIENT_ID) {
    return NextResponse.json({ message: "Invalid token audience" },{status:401});
  }
  const connectiondb=await connectdb();
  const [rows]=await connectiondb.execute('SELECT * FROM Ouser where accessToken=?',[accessToken])

  if(rows.length===0) return NextResponse.json({message:"Invalid token"},{status:401});
  
  return NextResponse.json({ message: "Access granted" },{status:200});

    } catch (error) {
        console.error("JWT validation error: ", error);
        return NextResponse.json({ message: 'JWT validation error: invalid token' }, { status: 500 })
    }
};
