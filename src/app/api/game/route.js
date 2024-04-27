import { NextResponse } from "next/server";
import { query } from "@/lib/mysql";

export async function GET(req) {
    try {
        const games = await query({
            query: "SELECT * FROM game",
            values: [],
        });

        let res = new NextResponse(
            JSON.stringify({
                message: "",
                games,
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
