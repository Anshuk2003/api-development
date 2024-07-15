/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Fetch all users
 *     description: Retrieves a list of all users from the database.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Users fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "12345"
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john.doe@example.com"
 *                       city:
 *                         type: string
 *                         example: "New York"
 *                       country:
 *                         type: string
 *                         example: "USA"
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
 *         description: Not found, user does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error while fetching users"
 */

import connectdb from "../../../../config/dbconfig";
import { NextResponse } from "next/server";
import { validateJWT } from "../../../helpers/validatejwt";

export async function GET(request) {
    try {
        const Response = await validateJWT(request);
        if (Response.status === 404 || Response.status===401) {
            return Response;
        }
        if (!Response || Response.status === 500) {
            // return NextResponse.json({ error: 'Unauthorized Invalid Token' }, { status: 401 });
            return Response;
        }
        const connectiondb = await connectdb();
        const [rows] = await connectiondb.execute('SELECT * FROM users');
        return NextResponse.json({
            message: 'Users fetched successfully',
            data: rows
        }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error while fetching users' }, { status: 500 });
    }
}