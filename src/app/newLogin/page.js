"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Corrected import for Next.js v10 and later
import {
    Container,
    TextField,
    Button,
    Alert,
    Box,
    Typography,
} from "@mui/material";
import { login } from "@/lib/auth";
import secureLocalStorage from "react-secure-storage"; // Assuming you have this installed

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

        const data = await res.json();

        if (data.message === `Login Successful`) {
            setMessage(data.message);
            setType("success");

            // Assuming `login` function handles session storage or similar
            // await login(data); // Make sure this function is adapted for MUI or removed if not necessary

            await login(data);

            secureLocalStorage.setItem("email", data.hero.email);
            secureLocalStorage.setItem("id", data.hero.id);

            router.push("/dashboard");
        } else {
            setMessage(data.message);
            setType("danger"); // Note: MUI uses 'error' instead of 'danger' for Alert severity
        }
        setShow(true);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {show && (
                    <Alert
                        severity={type === "danger" ? "error" : type}
                        onClose={() => setShow(false)}
                        sx={{ width: "100%" }}
                    >
                        {message}
                    </Alert>
                )}
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleLogin}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Box textAlign="center">
                        <Typography variant="body2">
                            Not a member?{" "}
                            <Button href="/register">Register</Button>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
