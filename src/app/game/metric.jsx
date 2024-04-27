"use client";

import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import Slider from "@mui/material/Slider";
import { useEffect, useState } from "react";
import { getUserID } from "@/lib/auth";

export default function Metric(param) {
    const [gameMetric, setGameMetric] = useState(param.metrico);
    const [playerMetric, setPlayerMetric] = useState(param.usero);
    const [editable, setEditable] = useState(false);
    const [preferences, setPreferences] = useState(() => {
        const initialPrefs = {};
        if (gameMetric?.preference) {
            Object.keys(gameMetric?.preference).forEach((category) => {
                initialPrefs[category] = {};
                gameMetric.preference[category].forEach((item) => {
                    initialPrefs[category][item] = 50; // Or another appropriate default value
                });
            });
        }
        return initialPrefs;
    });
    const [selections, setSelections] = useState(() => {
        const initialSelections = {};

        if (gameMetric?.select) {
            Object.keys(gameMetric?.select).forEach((metricKey) => {
                initialSelections[metricKey] = ""; // Assuming empty string as default
            });
        }
        return initialSelections;
    });

    useEffect(() => {
        // Set initial preferences based on playerMetric
        const generatePreferences = () => {
            const initialPreferences = {};
            Object.keys(gameMetric.preference).forEach((category) => {
                initialPreferences[category] = {};
                gameMetric.preference[category].forEach((item) => {
                    // Check if playerMetric has this category and item, else default to neutral value (50)
                    initialPreferences[category][item] =
                        playerMetric[category]?.[item] ?? 50;
                });
            });
            return initialPreferences;
        };

        // Set initial selections based on playerMetric for select type inputs
        const generateSelections = () => {
            const initialSelections = {};
            Object.keys(gameMetric.select).forEach((metricKey) => {
                // Use the value from playerMetric if available, otherwise default to an empty string
                initialSelections[metricKey] = playerMetric[metricKey] ?? "";
            });
            return initialSelections;
        };

        const setUI = async () => {
            const preferences = generatePreferences();
            const selections = generateSelections();

            setPreferences(preferences);
            setSelections(selections);
        };

        setUI();
    }, []);

    const marks = [
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

    const handleEditable = () => {
        setEditable(!editable);
    };

    const handleSave = async () => {
        setEditable(!editable);

        let updatedMetric = JSON.parse(JSON.stringify(preferences));

        Object.entries(selections).forEach(([key, value]) => {
            // If the key exists in preferences and both are objects, merge them deeper
            if (
                typeof updatedMetric[key] === "object" &&
                typeof value === "object"
            ) {
                updatedMetric[key] = { ...updatedMetric[key], ...value };
            } else {
                // For simple values or new keys, override or add directly
                updatedMetric[key] = value;
            }
        });

        try {
            const heroId = await getUserID();
            const gameId = param.gameId;

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/api/metric/${heroId}/${gameId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        metrics: updatedMetric,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
        } catch (error) {
            console.error("There was an error fetching the game:", error);
        }
    };

    const handleSliderChange = (category, item, newValue) => {
        setPreferences((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [item]: newValue,
            },
        }));
    };

    const handleSelectChange = (metricKey, value) => {
        setSelections((prev) => ({
            ...prev,
            [metricKey]: value,
        }));
    };

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                }}
            >
                <h1>Metrics</h1>
                {!editable && (
                    <Button sx={{ ml: 2 }} onClick={handleEditable}>
                        Edit
                    </Button>
                )}

                {editable && (
                    <Button sx={{ ml: 2 }} onClick={handleSave}>
                        Save
                    </Button>
                )}
            </Box>
            {gameMetric?.preference &&
                Object.entries(gameMetric.select).map(
                    ([metricKey, options]) => (
                        <FormControl
                            key={metricKey}
                            fullWidth
                            sx={{ m: 1, maxWidth: 200 }}
                        >
                            <InputLabel id={`${metricKey}-select-label`}>
                                {metricKey}
                            </InputLabel>
                            <Select
                                labelId={`${metricKey}-select-label`}
                                id={`${metricKey}-select`}
                                value={selections[metricKey]}
                                label={metricKey}
                                onChange={(e) =>
                                    handleSelectChange(
                                        metricKey,
                                        e.target.value
                                    )
                                }
                                disabled={!editable}
                            >
                                {Object.entries(options).map(
                                    ([label, value]) => (
                                        <MenuItem key={value} value={value}>
                                            {label}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                    )
                )}

            {gameMetric?.preference &&
                Object.keys(gameMetric.preference).map((category) => (
                    <Box key={category} sx={{ mt: 2 }}>
                        <Typography variant="h4">{category}</Typography>
                        {gameMetric.preference[category].map((item) => (
                            <Box key={item} sx={{ m: 1, ml: 2, maxWidth: 500 }}>
                                <Typography gutterBottom variant="h6">
                                    {item}
                                </Typography>
                                <Slider
                                    value={preferences[category][item] || 0} // Defaults to 0 if not initialized
                                    onChange={(e, newValue) =>
                                        handleSliderChange(
                                            category,
                                            item,
                                            newValue
                                        )
                                    }
                                    valueLabelDisplay="auto"
                                    marks={marks}
                                    min={0}
                                    max={100}
                                    step={25}
                                    sx={{ ml: 10 }}
                                    disabled={!editable}
                                />
                            </Box>
                        ))}
                    </Box>
                ))}
        </Box>
    );
}
