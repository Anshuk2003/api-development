/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: User logout
 *     description: Logs out the user by clearing the JWT token from cookies.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout Successfully"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */

import { NextResponse } from "next/server";
export async function POST() {
    try {
        const response = NextResponse.json({ message: "Logout Successfully" }, { status: 200 });
        response.cookies.set("token", "",
        { httpOnly: true, expires: new Date(0)
        })
        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
 
}