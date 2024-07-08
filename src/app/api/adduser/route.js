import connectdb from "../../../../config/dbconfig";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request) {
    try {
        
        const {id, name, email,city,country}=await request.json();
        if (!id || !name || !email) {
            return NextResponse.json({ error: 'Name and email, Id are required' }, { status: 400 });
        }
        const connectiondb=await connectdb();
        const [user]= await connectiondb.execute('INSERT INTO users (id, name, email,city,country) VALUES(?,?,?,?,?)',[id, name, email,city,country]);

        return NextResponse.json({ 
            message: "User added sucessfully",
            data: user,
            body:{
                "id":id,
                "name":name,
                "email":email,
                "city": city,
                "country":country
            }
         }, { status: 201 })
    } catch (error) {
        return NextResponse.json({error:"Cannot add user to database"},{status:500})
    }
}