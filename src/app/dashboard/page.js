"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Correct import for useRouter
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Typography,
} from "@mui/material";

export default function Dashboard() {
    const [games, setGames] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchGames = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/game`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            setGames(data.games);
        };

        fetchGames();
    }, []);

    const handleSelectGame = (gameId) => {
        router.push(`/game/${gameId}`);
    };

    return (
        <Container sx={{ py: 4, maxWidth: "lg" }}>
            <Grid container spacing={4}>
                {games.map((game, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="240"
                                image={`/${game.image}`}
                                alt={game.title}
                            />
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {game.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {game.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    onClick={() => handleSelectGame(game.id)}
                                >
                                    Select
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
