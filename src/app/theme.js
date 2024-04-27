"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    margin: 0,
                    padding: 0,
                    overflowX: "hidden",
                },
            },
        },
    },
    palette: {
        primary: {
            main: "#007bff", // This sets the primary color to a blue shade
        },
        white: {
            main: "#ffffff", // Define the main shade of white you will use
            contrastText: "#000000", // Optional: Define a contrasting text color for use on top of the white background
        },
    },
});

export default theme;
