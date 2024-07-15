/**
 * @swagger
 * /api/deleteuser:
 *   delete:
 *     summary: Delete a user
 *     description: Removes a user from the database based on the provided user ID.
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: The ID of the user to delete.
 *         schema:
 *           type: integer
 *           example: 12345
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       400:
 *         description: Bad request due to missing user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User Id is required"
 *       401:
 *         description: Unauthorized due to invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized Invalid Token"
 *       404:
 *         description: User does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User does not exist"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cannot delete user in database"
 */


import connectdb from "../../../../config/dbconfig";
import { NextResponse,NextRequest} from "next/server";
import { validateJWT } from "../../../helpers/validatejwt";

export async function DELETE(request) {
    try {
        const Response = await validateJWT(request);
        if (Response.status === 404 || Response.status===401) {
            return Response;
        }
        if (!Response || Response.status === 500) {
            // return NextResponse.json({ error: 'Unauthorized Invalid Token' }, { status: 401 });
            return Response;
        }
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