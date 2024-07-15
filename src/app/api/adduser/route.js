/**
 * @swagger
 * /api/adduser:
 *   post:
 *     summary: Add a new user
 *     description: Adds a new user to the database with the provided details.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The user's ID
 *                 example: "12345"
 *               name:
 *                 type: string
 *                 description: The user's name
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: "john.doe@example.com"
 *               city:
 *                 type: string
 *                 description: The user's city
 *                 example: "New York"
 *               country:
 *                 type: string
 *                 description: The user's country
 *                 example: "USA"
 *     responses:
 *       201:
 *         description: User added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "12345"
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
 *         description: Bad request due to missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Name and email, Id are required"
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cannot add user to database"
 */

import connectdb from "../../../../config/dbconfig";
import { NextResponse } from "next/server";
import { validateJWT } from "../../../helpers/validatejwt";

export async function POST(request) {
    try {
        const Response = await validateJWT(request);
        if (Response.status === 404 || Response.status===401) {
            return Response;
        }
        if (!Response || Response.status === 500) {
            // return NextResponse.json({ error: 'Unauthorized Invalid Token' }, { status: 401 });
            return Response;
        }
        const { id, name, email, city, country } = await request.json();
        if (!id || !name || !email) {
            return NextResponse.json({ error: 'Name and email, Id are required' }, { status: 400 });
        }
        const connectiondb = await connectdb();
        const [user] = await connectiondb.execute('INSERT INTO users (id, name, email,city,country) VALUES(?,?,?,?,?)', [id, name, email, city, country]);

        return NextResponse.json({
            message: "User added sucessfully",
            data: user,
            body: {
                "id": id,
                "name": name,
                "email": email,
                "city": city,
                "country": country
            }
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "Cannot add user to database" }, { status: 500 })
    }
}