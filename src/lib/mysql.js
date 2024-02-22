import mysql from "mysql2/promise";
import fs from "fs";

export async function query({ query, values = [] }) {
	//Digital ocean ubuntu
	const dbconnection = await mysql.createConnection({
		host: process.env.MYSQL_HOST,
		database: process.env.MYSQL_DATABASE,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
	});
	try {
		const [res] = await dbconnection.execute(query, values);
		dbconnection.end();
		return res;
	} catch (error) {
		throw error;
	}
}
