"use client";
import { useState } from "react";
import { getSession, getUserID } from "@/lib/auth";
import {
    AppBar,
    Box,
    Button,
    Container,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import Metric from "@/app/game/metric";
import Matchmake from "@/app/game/matchmake";
import secureLocalStorage from "react-secure-storage"; // Assuming you have this installed

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
                <Matchmake
                    gameId={params.param}
                    userId={secureLocalStorage.getItem("id")}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                Item Three
            </CustomTabPanel>
        </Container>
    );
}
