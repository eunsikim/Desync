import { NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { v4 as uuidv4 } from "uuid";

const bcrypt = require("bcrypt");
const saltRounds = 10;

export async function POST(req: Request) {
    const body = await req.json();

    const {
        first_name,
        last_name,
        email,
        password,
        birthdate,
        region,
        language,
    } = body;

    const id = uuidv4();

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    if (
        !first_name?.trim() ||
        !last_name?.trim() ||
        !email?.trim() ||
        !password?.trim() ||
        !birthdate?.trim() ||
        !region?.trim() ||
        !language?.trim()
    ) {
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
            query: `INSERT INTO hero(id, first_name, last_name, email, password, birthdate, region, language)
                        VALUES(?, ?, ?, ?, ?, ?, ?, ?);`,
            values: [
                id,
                first_name,
                last_name,
                email,
                hash,
                birthdate,
                region,
                language,
            ],
        });

        let res = new NextResponse(
            JSON.stringify({
                message: "Registration Successful",
                hero: {
                    id,
                    first_name,
                    last_name,
                    email,
                    birthdate,
                    region,
                    language,
                },
                res: hero,
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
        let message = "An unexpected error occured";
        let status = 500;

        if (err.code === "ER_DUP_ENTRY") {
            message = "This email is already being used";
            status = 409;
        }

        let res = new NextResponse(
            JSON.stringify({
                error_code: err.code,
                message: message,
                error_number: err.errno,
            }),
            {
                status: status,
                headers: {
                    "Content-Type": "application.json",
                },
            }
        );
        return res;
    }
}
