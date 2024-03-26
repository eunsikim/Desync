import { NextResponse } from "next/server";
import { query } from "@/lib/mysql";

export async function POST(req) {
    const body = await req.json();

    const { heroId, gameId, metrics } = body;

    try {
        const gameMetric = await query({
            query: "INSERT INTO gameMetric VALUES (?, ?, ?);",
            values: [heroId, gameId, metrics],
        });

        let res = new NextResponse(
            JSON.stringify({
                message: "Success",
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
export async function PUT(req) {
    const body = await req.json();

    const { heroId, gameId, metrics } = body;

    const stringMetric = JSON.stringify(metrics);

    try {
        const gameMetric = await query({
            query: "UPDATE gameMetric SET metrics = ? WHERE heroId = ? AND gameId = ?;",
            values: [stringMetric, heroId, gameId],
        });

        let res = new NextResponse(
            JSON.stringify({
                message: "Success",
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
                error: err,
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
