import connectdb from "../../../../config/dbconfig";
import { NextRequest,NextResponse } from "next/server";
import { validateJWT } from "../../../../helpers/validatejwt";

export async function GET(request) {
    try {
        const jwtResponse = await validateJWT(request);
        if (jwtResponse.status === 404) {
            return jwtResponse;
        }
        if (!jwtResponse || jwtResponse.status === 500) {
            return NextResponse.json({error :'Unauthorized Invalid Token' }, { status: 401 });
        }
        const connectiondb=await connectdb();
        const [rows]=await connectiondb.execute('SELECT * FROM users');
        return NextResponse.json({
            message: 'Users fetched successfully',
            data: rows
        },{status:200})
    } catch (error) {
        return NextResponse.json({error:'Error while fetching users'},{status:500});
        }
    }