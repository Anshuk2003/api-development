/**
 * @swagger
 * /api/updateuser:
 *   put:
 *     summary: Update user information
 *     description: Completely updates the user's information in the database based on the provided user ID.
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
 *         description: Bad request due to missing or invalid user ID
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
 *         description: User does not exist or no changes made
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User does not exist or No changes made"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cannot update user in database"
 */


import connectdb from "../../../../config/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import { validateJWT } from "../../../helpers/validatejwt";

export async function PUT(request) {
    try {
        const Response = await validateJWT(request);
        if (Response.status === 404) {
            return Response;
        }
        if (!Response || Response.status === 500) {
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
        // const [user]=await connectiondb.execute('SELECT * FROM users WHERE id=?',[userId]);
        // if (user[0].email !== jwtResponse) {
        //     return NextResponse.json({ message: 'Unauthorized to update user' }, { status: 401 });
        // }
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