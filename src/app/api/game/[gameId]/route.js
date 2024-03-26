import { NextResponse } from "next/server";
import { query } from "@/lib/mysql";

export async function GET(req, { params }) {
    const { gameId } = params;

    try {
        const game = await query({
            query: "SELECT * FROM game WHERE id = ?",
            values: [gameId],
        });
        let res = new NextResponse(
            JSON.stringify({
                message: "",
                game,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application.json",
                },
            }
        );
        return res;
    } catch (err) {
        let res = new NextResponse(
            JSON.stringify({
                message: "Error",
            }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application.json",
                },
            }
        );
        return res;
    }
}
