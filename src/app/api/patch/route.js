/**
 * @swagger
 * /api/patch:
 *   patch:
 *     summary: Update a user's information
 *     description: Updates the specified fields of a user in the database based on the provided user ID.
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: integer
 *           example: 12345
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               city:
 *                 type: string
 *                 example: "New York"
 *               country:
 *                 type: string
 *                 example: "USA"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 12345
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     city:
 *                       type: string
 *                       example: "New York"
 *                     country:
 *                       type: string
 *                       example: "USA"
 *       400:
 *         description: Bad request due to missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No valid fields to update"
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
 *         description: User does not exist or no changes made
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
 *                 message:
 *                   type: string
 *                   example: "Cannot update user"
 */


import connectdb from "../../../../config/dbconfig";
import { NextRequest,NextResponse } from "next/server";
import { validateJWT } from "../../../helpers/validatejwt";

export async function PATCH(request) {
    try {
        const Response = await validateJWT(request);
        if (Response.status === 404) {
            return Response;
        }
        if (!Response || Response.status === 500) {
            return NextResponse.json({error :'Unauthorized Invalid Token' }, { status: 401 });
        }
        const { searchParams } = new URL(request.url);
        const searchid= searchParams.get('id');
        
        const userId = parseInt(searchid, 10);

        if (isNaN(userId)) {
            return NextResponse.json({ error: 'User ID is needed' }, { status: 400 });
        }
        const {name,email,city,country}= await request.json();

        const updates = [];

        if (name) {
            updates.push({ field: 'name', value: name });
        }
        if (email) {
            updates.push({ field: 'email', value:email });
        }
        if (city) {
            updates.push({ field: 'city', value: city });
        }
        if (country) {
            updates.push({ field: 'country', value:country });
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
        }
        const updateFields = updates.map(u => `${u.field} = ?`).join(', ');
        const updateValues = updates.map(u => u.value);
        updateValues.push(userId);

        const connectiondb=await connectdb();
        const [user]=await connectiondb.execute('SELECT * FROM users WHERE id=?',[userId]);
        if(user.length===0) {
            return NextResponse({message:'User does not exist'},{status:404})
        }

        // if (user[0].email !== Response) {
        //     return NextResponse.json({ message: 'Unauthorized to update user' }, { status: 401 });
        // }

        const [result]=await connectiondb.execute(`UPDATE users SET ${updateFields} WHERE id = ?`,updateValues);
        if(result.affectedrows===0){
            return NextResponse.json({ error: 'No changes made' }, { status: 404 });
        }
        const updatedUser = {
            id: userId,
            name: name || user[0].name,
            email: email || user[0].email,
            city: city || user[0].city,
            country: country || user[0].country
        };
        
        return NextResponse.json({
            message: "User updated successfully",
            data: updatedUser
        }, { status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({message:'Cannot update user'},{status:500})
    }
}