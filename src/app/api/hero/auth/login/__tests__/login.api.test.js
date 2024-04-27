import "@testing-library/jest-dom/jest-globals";
import "@testing-library/jest-dom";
import { POST } from "@/app/api/hero/auth/login/route";

jest.mock("bcrypt", () => ({
	compareSync: jest.fn(
		(password, hashedPassword) => password === hashedPassword
	),
}));

jest.mock("@/lib/mysql", () => ({
	query: jest.fn().mockImplementation((req) => {
		// For cases where email does not exist in DB
		if (req.values != "JohnDoe123@gmail.com" && req.values !== "") {
			return false;
		}

		return Promise.resolve([
			{
				id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
				first_name: "John",
				last_name: "Doe",
				email: "JohnDoe123@gmail.com",
				password: "Password123!",
			},
		]);
	}),
}));

describe("Test Login", () => {
	test("Invalidate login wrong email", async () => {
		const req = {
			json: jest.fn().mockResolvedValue({
				email: "JohnDough123@gmail.com",
				password: "Password123!",
			}),
		};

		const res = await POST(req);
		const body = await res.json();

		expect(res.status).toBe(401);
		expect(body.message).toBe("Email does not exist");
	});

	test("Invalidate login wrong password", async () => {
		const req = {
			json: jest.fn().mockResolvedValue({
				email: "JohnDoe123@gmail.com",
				password: "ssssword123!!",
			}),
		};

		const res = await POST(req);
		const body = await res.json();

		expect(res.status).toBe(401);
		expect(body.message).toBe("Incorrect password");
	});

	test("Invalidate Empty fields", async () => {
		const req = {
			json: jest.fn().mockResolvedValue({
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

	test("Validate login", async () => {
		const req = {
			json: jest.fn().mockResolvedValue({
				email: "JohnDoe123@gmail.com",
				password: "Password123!",
			}),
		};

		const res = await POST(req);
		const body = await res.json();

		expect(res.status).toBe(200);
		expect(body.message).toBe("Login Successful");
	});
});
