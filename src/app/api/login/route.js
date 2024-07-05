import bcrypt from "bcryptjs/dist/bcrypt";
import connectdb from "../../../../config/dbconfig";
import { NextRequest,NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

export async function POST(request) {
    try {
        const reqbody=await request.json();
        console.log(reqbody)
        const {email,password}=reqbody;
        const connectiondb= await connectdb();
        const [existinguser]=await connectiondb.execute('select * from authuser where email=?',[email]);
        if(existinguser.length<0) return NextResponse({message:'User does not exist!'},{status:404})
        
        const validpassword=await bcrypt.compare(
            password,
            existinguser[0].password
        )
        if (!validpassword) {
            throw Error("Check your Credentials");
        }

        //create token
        const dataToBeSigned = {
            email: existinguser[0].email,
        }

        const token = jwt.sign(dataToBeSigned, process.env.JWT_SECRETE, {
            expiresIn: "1d",
        });

        const response = NextResponse.json(
            {
                message: "Login successful" ,
                token:token
            },
            { status: 200 }
        );
        response.cookies.set("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 1000, // 1 day expiration
        });
        return response;
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: 'Server down try after some time' },
            { status: 500 }
        )
    }
}