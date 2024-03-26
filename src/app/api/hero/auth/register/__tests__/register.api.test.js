import "@testing-library/jest-dom/jest-globals";
import "@testing-library/jest-dom";
import { POST } from "@/app/api/hero/auth/register/route";

jest.mock("bcrypt", () => ({
	genSaltSync: jest.fn(),
	hashSync: jest.fn((password, salt) => password),
}));

jest.mock("uuid", () => ({
	v4: jest.fn(() => "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
}));

jest.mock("@/lib/mysql", () => ({
	query: jest.fn().mockImplementation((req) => {
		const email = req.values[3];

		// Simulates a error 409 this email is already being used
		if (email === "JohnDoe123@gmail.com") {
			// return false;
			return Promise.reject({
				code: "ER_DUP_ENTRY",
				message: "This email is already being used",
				errno: 1062, // Example error number for duplicate entry
			});
		}

		return Promise.resolve([
			{
				fieldCount: 0,
				affectedRows: 1,
				insertId: 0,
				info: "",
				serverStatus: 2,
				warningStatus: 0,
				changedRows: 0,
			},
		]);
	}),
}));

describe("Test Register API responses", () => {
	test("For registering with email already in use", async () => {
		const req = {
			json: jest.fn().mockResolvedValue({
				first_name: "John",
				last_name: "Doe",
				email: "JohnDoe123@gmail.com",
				password: "Password123!",
			}),
		};

		const res = await POST(req);
		const body = await res.json();

		expect(res.status).toBe(409);
		expect(body.message).toBe("This email is already being used");
	});

	test("For empty input fields", async () => {
		const req = {
			json: jest.fn().mockResolvedValue({
				first_name: "",
				last_name: "",
				email: "",
				password: "",
			}),
		};

		const res = await POST(req);
		const body = await res.json();

		expect(res.status).toBe(400);
		expect(body.message).toBe(
			"All fields are required and cannot be empty."
		);
	});

	test("For valid registration", async () => {
		const req = {
			json: jest.fn().mockResolvedValue({
				first_name: "John",
				last_name: "Doe",
				email: "JohnDoe456@gmail.com",
				password: "password123!",
			}),
		};

		const res = await POST(req);
		const body = await res.json();

		expect(res.status).toBe(200);
		expect(body.message).toBe("Registration Successful");
	});
});
