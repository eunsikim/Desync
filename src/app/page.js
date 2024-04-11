"use client";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
    Container,
    Grid,
    Typography,
    Button,
    AppBar,
    Toolbar,
    Box,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import theme from "@/app/theme";
import NavBar from "@/components/navBar";

export default function Page() {
    return (
        <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />

            {/* <NavBar /> */}

            {/* Hero Section */}
            <Box
                sx={{
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    //backgroundColor: "primary.main",
                    //color: "white",
                    // If you want to add a background image
                    // backgroundImage: 'url(https://example.com/your-image.jpg)',
                    // backgroundSize: 'cover',
                }}
            >
                <Container maxWidth="lg" style={{ padding: "2rem 0" }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h2" gutterBottom>
                                Desync
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Matching players, creating memories
                            </Typography>
                            <Button variant="contained" color="primary">
                                Learn More
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {/* Placeholder for an image or a component */}
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    width: "100%",
                    py: 3,
                    px: 2,
                    mt: "auto",
                    backgroundColor: "background.paper",
                    textAlign: "center",
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="body1" align="center">
                        Footer
                    </Typography>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
