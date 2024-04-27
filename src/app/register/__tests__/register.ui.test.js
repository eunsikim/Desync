import {
    render,
    screen,
    fireEvent,
    getByLabelText,
    act,
} from "@testing-library/react";
import "@testing-library/jest-dom/jest-globals";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Page from "@/app/register/page";

// Mock
global.fetch = jest.fn((http, req) => {
    const { first_name, last_name, email, password } = JSON.parse(req.body);

    let message;

    if (
        !first_name?.trim() ||
        !last_name?.trim() ||
        !email?.trim() ||
        !password?.trim()
    ) {
        message = "All fields are required and cannot be empty.";
    } else if (email === "JohnDoe123@gmail.com") {
        message = "This email is already being used";
    } else {
        message = "Registration Successful";
    }

    const res = {
        json: jest.fn().mockResolvedValue({
            message: message,
        }),
    };

    return res;
});

describe("Test Register Fetch Request Validation", () => {
    test("For Empty input fields", async () => {
        const user = userEvent.setup();

        render(<Page />);

        const fname = screen.getByLabelText("First Name");
        const lname = screen.getByLabelText("Last Name");
        const email = screen.getByLabelText("Email");
        const password = screen.getByLabelText("Password");
        const button = screen.getByText("Register");

        await user.type(fname, " ");
        await user.type(lname, " ");
        await user.type(email, " ");
        await user.type(password, " ");
        fireEvent.click(button);

        const alert = await screen.findByRole("alert");

        expect(alert).toHaveTextContent(
            "All fields are required and cannot be empty."
        );
    });

    test("For registering using an already used email", async () => {
        const user = userEvent.setup();

        render(<Page />);

        const fname = screen.getByLabelText("First Name");
        const lname = screen.getByLabelText("Last Name");
        const email = screen.getByLabelText("Email");
        const password = screen.getByLabelText("Password");
        const button = screen.getByText("Register");

        await user.type(fname, "John");
        await user.type(lname, "Doe");
        await user.type(email, "JohnDoe123@gmail.com");
        await user.type(password, "password123!");
        fireEvent.click(button);

        const alert = await screen.findByRole("alert");

        expect(alert).toHaveTextContent("This email is already being used");
    });

    test("For Valid Registration", async () => {
        const user = userEvent.setup();

        render(<Page />);

        const fname = screen.getByLabelText("First Name");
        const lname = screen.getByLabelText("Last Name");
        const email = screen.getByLabelText("Email");
        const password = screen.getByLabelText("Password");
        const button = screen.getByText("Register");

        await user.type(fname, "John");
        await user.type(lname, "Doe");
        await user.type(email, "JohnDoe456@gmail.com");
        await user.type(password, "password123!");
        fireEvent.click(button);

        const alert = await screen.findByRole("alert");

        expect(alert).toHaveTextContent("Registration Successful");
    });
});
