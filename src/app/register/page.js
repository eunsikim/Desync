"use client";
import React, { useState, useEffect } from "react";
import {
    Container,
    TextField,
    Button,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function page() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [birthdate, setBirthdate] = useState(dayjs()); // default value from MUI documentation
    const [region, setRegion] = useState("");
    const [language, setLanguage] = useState("");

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("success");

    // useEffect(() => {
    //     console.log(birthdate.format("MM-DD-YYYY"));
    // }, [birthdate]);

    // useEffect(() => {
    //     console.log(region);
    //     console.log(language);
    // }, [region, language]);

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
                    birthdate: birthdate.format("YYYY-MM-DD"),
                    region: region,
                    language: language,
                }),
            }
        );

        const data = await res.json();

        if (data.message === `Registration Successful`) {
            setAlertMessage(data.message);
            setAlertType("success");

            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
        } else {
            setAlertMessage(data.message);
            setAlertType("danger");
            setPassword("");
        }
        setShowAlert(true);
    };

    return (
        <Container component="main" maxWidth="sm" sx={{ mt: 4 }}>
            <Box
                component="form"
                onSubmit={handleRegistration}
                noValidate
                sx={{ mt: 1 }}
            >
                {showAlert && (
                    <Alert
                        severity={alertType}
                        onClose={() => setShowAlert(false)}
                        dismissible="true"
                    >
                        {alertMessage}
                    </Alert>
                )}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Birthdate"
                        value={birthdate}
                        onChange={(newValue) => {
                            setBirthdate(newValue);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} fullWidth margin="normal" />
                        )}
                    />
                </LocalizationProvider>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Region</InputLabel>
                    <Select
                        value={region}
                        label="Region"
                        onChange={(e) => setRegion(e.target.value)}
                    >
                        <MenuItem value="NAE">
                            NAE - North America East
                        </MenuItem>
                        <MenuItem value="NAC">
                            NAC - North America Central
                        </MenuItem>
                        <MenuItem value="NAW">
                            NAW - North America West
                        </MenuItem>
                        <MenuItem value="LATAM">LATAM - Latin America</MenuItem>
                        <MenuItem value="EU">EU - Europe</MenuItem>
                        <MenuItem value="OCE">OCE - Oceania</MenuItem>
                        <MenuItem value="ASIA">ASIA - Asia</MenuItem>
                        <MenuItem value="ME">ME - Middle East</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Language</InputLabel>
                    <Select
                        value={language}
                        label="Language"
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="Spanish">Spanish</MenuItem>
                        <MenuItem value="Korean">Korean</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Register
                </Button>
            </Box>
        </Container>
    );
}
