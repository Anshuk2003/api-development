import connectdb from "../../../../config/dbconfig";
import { NextResponse,NextRequest} from "next/server";

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const searchid= searchParams.get('id');
        
        if(!searchid){
            return NextResponse.json({ error: 'User Id is required' }, { status: 400 });
        }
        const userId = parseInt(searchid, 10);
        const connectiondb=await connectdb();
        const [result] = await connectiondb.execute('DELETE FROM users WHERE id = ?', [userId]);
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
        }
        return NextResponse.json({
            message:"User deleted successfully",
        },{status:200})
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ error: "Cannot delete user in database" }, { status: 500 });
    }
}