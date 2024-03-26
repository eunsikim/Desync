import { NextResponse } from "next/server";
import { query } from "@/lib/mysql";

export async function GET(req, { params }) {
    // TODO: Find another way to handle retrieval without exposing userId
    const { heroId, gameId } = params;

    try {
        const gameMetric = await query({
            query: "SELECT * FROM gameMetric WHERE heroId = ? AND gameId = ?",
            values: [heroId, gameId],
        });

        let res = new NextResponse(
            JSON.stringify({
                message: "",
                gameMetric,
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
