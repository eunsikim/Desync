import Server, { NextResponse, NextRequest } from "next/server";
import { query } from "@/lib/mysql";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
	const body = await req.json();

	const { email, password } = body;

	// All fields required check
	if (!email?.trim() || !password?.trim()) {
		let res = new NextResponse(
			JSON.stringify({
				message: "All fields are required and cannot be empty.",
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

	try {
		const hero = await query({
			query: `SELECT * FROM hero WHERE email = ?;`,
			values: [email],
		});

		const hashedPass = hero[0].password;

		if (bcrypt.compareSync(password, hashedPass)) {
			const { id, first_name, last_name, email } = hero[0];

			let res = new NextResponse(
				JSON.stringify({
					message: "Login Successful",
					hero: { id, first_name, last_name, email },
				}),
				{
					status: 200,
					headers: {
						"Content-Type": "application.json",
					},
				}
			);
			return res;
		} else {
			let res = new NextResponse(
				JSON.stringify({
					message: "Incorrect password",
					hero: { email, password },
				}),
				{
					status: 401,
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
				message: "Email does not exist",
				hero: { email, password },
			}),
			{
				status: 401,
				headers: {
					"Content-Type": "application.json",
				},
			}
		);
		return res;
	}
}
