import connectdb from "../../../../config/dbconfig";
import { NextRequest,NextResponse } from "next/server";

export async function PUT(request){
    try {
        const { searchParams } = new URL(request.url);
        const searchid= searchParams.get('id');
        
        if(!searchid){
            return NextResponse.json({ error: 'User Id is required' }, { status: 400 });
        }
        const userId = parseInt(searchid, 10);
        const {name,email}= await request.json();
        const connectiondb=await connectdb();
        //const [updateduser]=connectiondb.execute('Update users SET name=? ,email=? WHERE id=?',[name,email,userId])
        const [result] = await connectiondb.execute('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId]);
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'User does not exist or No changes made' }, { status: 404 });
        }
        const upduser={
            "id":userId,
            "name":name,
            "email":email
        }
        return NextResponse.json({
            message:"User updated successfully",
            data:upduser
        },{status:200})
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ error: "Cannot update user in database" }, { status: 500 });
    }
}