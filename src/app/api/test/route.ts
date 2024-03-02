import Server, { NextResponse } from "next/server";

export async function GET() {
	// return Server.NextResponse.json({
	// 	hello: "world",
	// });

	return new NextResponse(
		JSON.stringify({
			hello: "world",
		})
	);
}
