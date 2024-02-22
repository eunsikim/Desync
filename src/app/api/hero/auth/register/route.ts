import { NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { v4 as uuidv4 } from "uuid";

const bcrypt = require("bcrypt");
const saltRounds = 10;

export async function POST(req: Request) {
	const body = await req.json();

	const { first_name, last_name, email, password } = body;

	const id = uuidv4();

	const salt = bcrypt.genSaltSync(saltRounds);
	const hash = bcrypt.hashSync(password, salt);

	if (
		!first_name?.trim() ||
		!last_name?.trim() ||
		!email?.trim() ||
		!password?.trim()
	) {
		return NextResponse.json(
			{
				message: "All fields are required and cannot be empty.",
			},
			{
				status: 400,
				headers: {
					"Content-Type": "application.json",
				},
			}
		);
	}

	try {
		const res = await query({
			query: `INSERT INTO hero(id, first_name, last_name, email, password)
                        VALUES(?, ?, ?, ?, ?);`,
			values: [id, first_name, last_name, email, hash],
		});

		return NextResponse.json(
			{
				message: "Registration Successful",
				hero: { id, first_name, last_name, email },
				res: res,
			},
			{
				status: 200,
				headers: {
					"Content-Type": "application.json",
				},
			}
		);
	} catch (err) {
		let message = "An unexpected error occured";
		let status = 500;

		if (err.code === "ER_DUP_ENTRY") {
			message = "This email is already being used";
			status = 409;
		}

		return NextResponse.json(
			{
				error_code: err.code,
				message: message,
				error_number: err.errno,
			},
			{
				status: status,
				headers: {
					"Content-Type": "application.json",
				},
			}
		);
	}
}
