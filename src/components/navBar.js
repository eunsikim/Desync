"use client";
import React, { useEffect, useState } from "react";
import { Typography, Button, AppBar, Toolbar, Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import theme from "@/app/theme";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import { getSession } from "@/lib/auth";
import { logout } from "@/lib/auth";

export default function NavBar({ logged }) {
    const [firstName, setFirstName] = useState("");

    const router = useRouter();

    useEffect(() => {
        if (logged) {
            const storedFirstName = secureLocalStorage.getItem("firstName");
            setFirstName(storedFirstName);
        }
    }, [logged]);

    const loggOut = async () => {
        await logout();
        secureLocalStorage.removeItem("email");
        secureLocalStorage.removeItem("id");
        secureLocalStorage.removeItem("firstName");
        secureLocalStorage.removeItem("lastName");
        router.push("/");
    };

    const handleLogoClick = () => {
        if (logged) {
            router.push("/dashboard");
        } else {
            router.push("/");
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            cursor: "pointer",
                        }}
                        onClick={handleLogoClick}
                    >
                        Desync
                    </Typography>

                    {logged && (
                        <>
                            <Typography sx={{ mr: 2 }}>
                                Welcome, {firstName}
                            </Typography>
                            <Button
                                // component="a"
                                sx={{
                                    mr: 2,
                                    "&:hover": {
                                        color: theme.palette.primary.main,
                                        backgroundColor:
                                            theme.palette.white.main,
                                    },
                                }}
                                variant="text"
                                color="inherit"
                                onClick={loggOut}
                            >
                                Log out
                            </Button>
                        </>
                    )}
                    {!logged && (
                        <>
                            <Button
                                // component="a"
                                sx={{
                                    mr: 2,
                                    "&:hover": {
                                        color: theme.palette.primary.main,
                                        backgroundColor:
                                            theme.palette.white.main,
                                    },
                                }}
                                variant="text"
                                color="inherit"
                                href="/login"
                            >
                                Login
                            </Button>

                            <Button
                                sx={{
                                    backgroundColor: theme.palette.white.main, // Use the custom white color
                                    "&:hover": {
                                        boxShadow: theme.shadows[10],
                                        backgroundColor:
                                            theme.palette.white.main,
                                    },
                                }}
                                href="/register"
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
