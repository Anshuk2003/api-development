import connectdb from "../../../../config/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import {validateJWT} from "../../../../helpers/validatejwt"

export async function PUT(request) {
    try {
        const jwtResponse = await validateJWT(request);
        if (jwtResponse.status === 404) {
            return jwtResponse;
        }
        if (!jwtResponse || jwtResponse.status === 500) {
            return NextResponse.json({error :'Unauthorized Invalid Token' }, { status: 401 });
        }
        const { searchParams } = new URL(request.url);
        const searchid = searchParams.get('id');

        if (!searchid) {
            return NextResponse.json({ error: 'User Id is required' }, { status: 400 });
        }
        const userId = parseInt(searchid, 10);
        const { name, email, city, country } = await request.json();
        const connectiondb = await connectdb();
        const [user]=await connectiondb.execute('SELECT * FROM users WHERE id=?',[userId]);
        if (user[0].email !== jwtResponse) {
            return NextResponse.json({ message: 'Unauthorized to update user' }, { status: 401 });
        }
        //const [updateduser]=connectiondb.execute('Update users SET name=? ,email=? WHERE id=?',[name,email,userId])
        const [result] = await connectiondb.execute('UPDATE users SET name = ?, email = ?,city= ?,country=? WHERE id = ?', [name, email, city, country, userId]);
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'User does not exist or No changes made' }, { status: 404 });
        }
        const upduser = {
            "id": userId,
            "name": name,
            "email": email,
            "city": city,
            "country": country
        }
        return NextResponse.json({
            message: "User updated successfully",
            data: upduser
        }, { status: 200 })
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ error: "Cannot update user in database" }, { status: 500 });
    }
}