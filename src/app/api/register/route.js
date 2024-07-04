import bcrypt from "bcryptjs/dist/bcrypt";
import connectdb from "../../../../config/dbconfig";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request){
    try {
        const reqbody= await request.json();
        const {name,email,password}=reqbody;
        const connectiondb= await connectdb();
        const [existinguser]=await connectiondb.execute('select * from authuser where email=?',[email]);
        if(existinguser.length>0) return NextResponse({message:'User already exist'},{status:409})
        
        const salt= await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [newuser]= await connectiondb.execute('INSERT INTO authuser (email,password,name) VALUES(?,?,?)',[email, hashedPassword, name]);

        return NextResponse.json({ 
            message: "User registered sucessfully",
            data:newuser,
            body: {
                "name":name,
                "email":email
            }
         }, { status: 201 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:"Cannot register user to database"},{status:500})
    }
}