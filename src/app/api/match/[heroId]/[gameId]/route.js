import { NextResponse } from "next/server";
import { query } from "@/lib/mysql";

export async function GET(req, { params }) {
    // TODO: Find another way to handle retrieval without exposing userId
    const { heroId, gameId } = params;

    console.info(`CALLEDs: ${JSON.stringify(params)}`);

    try {
        // const gameMetric = await query({
        //     query: "SELECT gameMetric.metrics FROM gameMetric WHERE heroId != ?",
        //     values: [heroId, gameId],
        // });

        const gameMetric = await query({
            query: "SELECT gm.metrics, h.first_name, h.last_name FROM gameMetric gm LEFT JOIN hero h ON gm.heroId = h.id WHERE gm.heroId != ? AND gm.gameId = ?",
            values: [heroId, gameId],
        });

        if (gameMetric.length === 0) {
            let res = new NextResponse(
                JSON.stringify({
                    message: "No Content",
                }),
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application.json",
                    },
                }
            );
            return res;
        } else {
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
        }
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
