"use client";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { React, useState } from "react";
import {
	MDBContainer,
	MDBInput,
	MDBCheckbox,
	MDBBtn,
	MDBIcon,
} from "mdb-react-ui-kit";
import { Alert } from "react-bootstrap";

export default function login() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [show, setShow] = useState(false);
	const [message, setMessage] = useState("");
	const [type, setType] = useState("");

	const handleRegistration = async (e) => {
		e.preventDefault();

		const res = await fetch(
			`${process.env.NEXT_PUBLIC_URL}/api/hero/auth/register`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					first_name: firstName,
					last_name: lastName,
					email: email,
					password: password,
				}),
			}
		);

		const data = await res.json();

		if (data.message === `Registration Successful`) {
			setMessage(data.message);
			setType("success");

			setFirstName("");
			setLastName("");
			setEmail("");
			setPassword("");
		} else {
			setMessage(data.message);
			setType("danger");
			setPassword("");
		}
		setShow(true);
	};

	return (
		<MDBContainer className="p-4 my-5 d-flex flex-column w-50">
			<form
				onSubmit={handleRegistration}
				className="p-4 my-5 d-flex flex-column"
			>
				{show && (
					<Alert
						key={type}
						variant={type}
						onClose={() => setShow(false)}
						dismissible
					>
						{message}
					</Alert>
				)}
				<MDBInput
					wrapperClass="mb-4"
					label="First Name"
					value={firstName}
					id="form1"
					type="name"
					onChange={(e) => setFirstName(e.target.value)}
				/>
				<MDBInput
					wrapperClass="mb-4"
					label="Last Name"
					value={lastName}
					id="form2"
					type="name"
					onChange={(e) => setLastName(e.target.value)}
				/>
				<MDBInput
					wrapperClass="mb-4"
					label="Email"
					value={email}
					id="form3"
					type="email"
					onChange={(e) => setEmail(e.target.value)}
				/>
				<MDBInput
					wrapperClass="mb-4"
					label="Password"
					value={password}
					id="form4"
					type="password"
					onChange={(e) => setPassword(e.target.value)}
				/>
				<MDBBtn type="submit" className="mb-4">
					Register
				</MDBBtn>
			</form>
		</MDBContainer>
	);
}
