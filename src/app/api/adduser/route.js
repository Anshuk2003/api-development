import connectdb from "../../../../config/dbconfig";
import { NextRequest,NextResponse } from "next/server";
import { validateJWT } from "../../../../helpers/validatejwt";
export async function POST(request) {
    try {
        const jwtResponse = await validateJWT(request);
        if (jwtResponse.status === 404) {
            return jwtResponse;
        }
        if (!jwtResponse || jwtResponse.status === 500) {
            return NextResponse.json({error :'Unauthorized Invalid Token' }, { status: 401 });
        }
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