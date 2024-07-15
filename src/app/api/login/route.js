/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token if the credentials are valid.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   example: "jwt.token.here"
 *       404:
 *         description: User does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User does not exist!"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server down try after some time"
 */


import bcrypt from "bcryptjs/dist/bcrypt";
import connectdb from "../../../../config/dbconfig";
import { NextRequest,NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {
        const reqbody=await request.json();
        // console.log(reqbody)
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