import { NextResponse } from "next/server";
import { query } from "@/lib/mysql";

export async function GET(req, { params }) {
    // TODO: Find another way to handle retrieval without exposing userId
    const { heroId, gameId } = params;

    console.info(`CALLED: ${JSON.stringify(params)}`);

    try {
        const gameMetric = await query({
            query: "SELECT * FROM gameMetric WHERE heroId = ? AND gameId = ?",
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

export async function PATCH(req, { params }) {
    const body = await req.json();

    const { heroId, gameId } = params;
    const { metrics } = body;

    try {
        const updateMetrics = await query({
            query: "UPDATE gameMetric SET metrics = ? WHERE heroId = ? AND gameId = ?",
            values: [metrics, heroId, gameId],
        });

        let res = new NextResponse(
            JSON.stringify({
                message: "",
                updateMetrics,
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

export async function POST(req, { params }) {
    const body = await req.json();

    const { heroId, gameId } = params;
    const { metrics } = body;

    try {
        const gameMetric = await query({
            query: "INSERT INTO gameMetric(heroId, gameID, metrics) VALUES (?, ?, ?);",
            values: [heroId, gameId, metrics],
        });

        let res = new NextResponse(
            JSON.stringify({
                message: "",
                metrics,
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
