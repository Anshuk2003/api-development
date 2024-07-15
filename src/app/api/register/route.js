/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with the provided email and password.
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
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *       409:
 *         description: Conflict, user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User already exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cannot register user to database"
 */

import bcrypt from "bcryptjs/dist/bcrypt";
import connectdb from "../../../../config/dbconfig";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request){
    try {
        const reqbody= await request.json();
        const {email,password}=reqbody;
        const connectiondb= await connectdb();
        const [existinguser]=await connectiondb.execute('select * from authuser where email=?',[email]);
        
        if(existinguser.length>0) return NextResponse({message:'User already exist'},{status:409})
        
        const salt= await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [newuser]= await connectiondb.execute('INSERT INTO authuser (email,password) VALUES(?,?)',[email, hashedPassword]);

        return NextResponse.json({ 
            message: "User registered sucessfully",
            data:newuser,
            body: {
                "email":email
            }
         }, { status: 201 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:"Cannot register user to database"},{status:500})
    }
}