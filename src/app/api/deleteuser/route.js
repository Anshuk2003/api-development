import connectdb from "../../../../config/dbconfig";
import { NextResponse,NextRequest} from "next/server";
import { validateJWT } from "../../../../helpers/validatejwt";
export async function DELETE(request) {
    try {
        const jwtResponse = await validateJWT(request);
        if (jwtResponse.status === 404){
            return jwtResponse;
        }
        if(!jwtResponse || jwtResponse.status === 500) {
            return NextResponse.json({error :'Unauthorized Invalid Token' }, { status: 401 });
        }
        const { searchParams } = new URL(request.url);
        const searchid= searchParams.get('id');
        
        if(!searchid){
            return NextResponse.json({ error: 'User Id is required' }, { status: 400 });
        }
        const userId = parseInt(searchid, 10);
        const connectiondb=await connectdb();
        const [useremail]=await connectiondb.execute('select email from users where id=?',[userId])

        if (useremail[0].email !== jwtResponse) {
            return NextResponse.json({ message: 'Unauthorized to update user' }, { status: 401 });
        }

        const [result] = await connectiondb.execute('DELETE FROM authuser WHERE email = ?', [useremail[0].email]);
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