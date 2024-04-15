import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Slider,
    AccordionDetails,
    AccordionSummary,
    Accordion,
} from "@mui/material";
// import Accordion from "@mui/material/Accordion";
import { matchmakingAlgo } from "@/lib/matchmaking";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const sliderMarks = [
    {
        value: 0,
        label: "Strongly Dislike",
    },
    {
        value: 25,
        label: "Dislike",
    },
    {
        value: 50,
        label: "Neutral",
    },
    {
        value: 75,
        label: "Prefer",
    },
    {
        value: 100,
        label: "Strongly Prefer",
    },
];

export default function Matchmake({ gameId, userId }) {
    const [playerList, setPlayerList] = useState([]);

    const getPlayerList = async () => {
        const res = await matchmakingAlgo({ gameId, userId });
        setPlayerList(res);
    };

    useEffect(() => {
        getPlayerList();
    }, [gameId, userId]);

    const renderPreferenceSliders = (preferences, category, player) => (
        <Accordion key={`AccordionDetails${player.name}-${category}`}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel1-content-${player.name}-${category}`}
                id={`panel1-header-${player.name}-${category}`}
            >
                {category}
            </AccordionSummary>
            <AccordionDetails
                key={`AccordionDetails${player.name}-${category}`}
                sx={{ my: 2 }}
            >
                <Typography variant="h6" gutterBottom>
                    {category}:
                </Typography>
                {Object.entries(preferences).map(([key, value]) => (
                    <Box
                        key={`${category}-${key}-${player.name}`}
                        sx={{
                            mb: 2,
                            maxWidth: 500,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            gutterBottom
                            sx={{ textAlign: "center", width: "100%" }}
                            variant="h6"
                        >
                            {key}
                        </Typography>
                        <Slider
                            value={value}
                            marks={sliderMarks}
                            step={25}
                            min={0}
                            max={100}
                            valueLabelDisplay="auto"
                            sx={{ ml: 10 }}
                            disabled
                        />
                    </Box>
                ))}
            </AccordionDetails>
        </Accordion>
    );

    return (
        <Box sx={{ display: "flex", flexDirection: "column", margin: "20px" }}>
            <Button
                variant="contained"
                color="primary"
                onClick={getPlayerList}
                sx={{ marginBottom: "20px" }}
            >
                Start Matchmaking
            </Button>
            <List>
                {playerList.map((player, index) => (
                    <React.Fragment key={`player-${player.name}-${index}`}>
                        <Card variant="outlined" sx={{ marginBottom: "10px" }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {player.name} : Score{" "}
                                    {player.totalCompatibility.toFixed(4) * 100}{" "}
                                    %
                                </Typography>
                                <Typography color="text.secondary">
                                    Rank: {player.Rank}
                                </Typography>

                                {Object.keys(player)
                                    .filter(
                                        (key) => typeof player[key] === "object"
                                    )
                                    .map((subCategory) =>
                                        renderPreferenceSliders(
                                            player[subCategory],
                                            subCategory,
                                            player
                                        )
                                    )}
                            </CardContent>
                        </Card>
                        {index < playerList.length - 1 && (
                            <Divider variant="inset" component="li" />
                        )}
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
}
