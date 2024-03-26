"use client";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { React, useState } from "react";
import {
    MDBContainer,
    MDBCheckbox,
    MDBBtn,
    MDBIcon,
    MDBInput,
} from "mdb-react-ui-kit";
import { Alert } from "react-bootstrap";
import { login } from "@/lib/auth";
import secureLocalStorage from "react-secure-storage"; // Added to secure access to userId

export default function Page() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");

    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/hero/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            }
        );

        // console.log(await res.json());

        const data = await res.json();

        if (data.message === `Login Successful`) {
            setMessage(data.message);
            setType("success");

            await login(data);

            secureLocalStorage.setItem("email", data.hero.email);
            secureLocalStorage.setItem("id", data.hero.id);

            router.push("/dashboard");
        } else {
            setMessage(data.message);
            setType("danger");
        }
        setShow(true);
    };

    return (
        <MDBContainer className="p-4 my-5 d-flex flex-column w-50">
            <form
                onSubmit={handleLogin}
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
                    label="Email address"
                    id="form1"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    data-lpignore="true" //This fixes hydration error using LastPass
                />
                <MDBInput
                    wrapperClass="mb-4"
                    label="Password"
                    id="form2"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    data-lpignore="true" //This fixes hydration error using LastPass
                />
                <MDBBtn type="submit" className="mb-4">
                    Sign in
                </MDBBtn>
            </form>
            <div className="text-center">
                <p>
                    Not a member? <a href="/register">Register</a>
                </p>
            </div>
        </MDBContainer>
    );
}
