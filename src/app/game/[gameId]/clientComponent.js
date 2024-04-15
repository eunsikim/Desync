"use client";
import { useEffect, useState } from "react";
import { getSession, getUserID } from "@/lib/auth";
import { AppBar, Box, Container, Tab, Tabs, Typography } from "@mui/material";
import PropTypes from "prop-types";
import Metric from "@/app/game/metric";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function ClientComponent(params) {
    const [gameId, setGameId] = useState("");
    const [gameTitle, setGameTitle] = useState("");
    const [gameDesc, setGameDesc] = useState("");
    const [gameMetric, setGameMetric] = useState({});

    const [value, setValue] = useState(0);

    useEffect(() => {
        const getGame = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/api/game/${params.param}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await res.json();

            setGameId(data.game[0].id);
            setGameTitle(data.game[0].title);
            setGameDesc(data.game[0].description);
            setGameMetric(data.game[0].metric);

            const testing = await gameMetric;
        };

        const sesh = async () => {
            const sessionPayload = await getUserID();

            console.log(sessionPayload);
        };

        // getGame();
        // sesh();
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Container sx={{}}>
            <h1>{gameTitle}</h1>

            <AppBar position="static">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="inherit"
                    indicatorColor="secondary"
                    aria-label="game tab panel"
                    variant="fullWidth"
                >
                    <Tab {...a11yProps(0)} label="Metrics" />
                    <Tab {...a11yProps(1)} label="Matchmake" />
                    <Tab {...a11yProps(2)} label="Connections" />
                </Tabs>
            </AppBar>
            <CustomTabPanel value={value} index={0}>
                <Metric
                    gameId={params.param}
                    metrico={params.metrico}
                    usero={params.usero}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                Item Two
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                Item Three
            </CustomTabPanel>
        </Container>
    );
}
