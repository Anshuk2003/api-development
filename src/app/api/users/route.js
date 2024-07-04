import connectdb from "../../../../config/dbconfig";

import { NextRequest,NextResponse } from "next/server";



export async function GET(request) {
    try {
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