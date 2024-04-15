import { getUserID } from "@/lib/auth";

export default async function ServerComponent(gameId) {
    const getGameMetric = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL}api/game/${gameId}`
            );
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            const gameData = await res.json();

            return gameData;
        } catch (error) {
            console.error("There was an error fetching the game:", error);
        }
        return { game: [{ metric: {} }] };
    };

    const getUserMetric = async () => {
        try {
            const heroId = await getUserID();

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/api/metric/${heroId}/${gameId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(res.status);

            if (res.status === 404) {
                const newMetric = await addUser();
                return newMetric;
            } else if (res.status != 200) {
                console.log("asd");
                throw new Error("Network response was not ok");
            }
            const metricData = await res.json();

            return metricData;
        } catch (error) {
            console.error("There was an error fetching the game:", error);
            return {
                gameMetric: [
                    {
                        metrics: {},
                    },
                ],
            };
        }
    };

    const addUser = async () => {
        // Get default game metric
        const getDefaultMetric = async () => {
            try {
                // const gameId = gameId;

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_URL}/api/game/${gameId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const game = await res.json();

                const default_metric = game.game[0].default_metric;
                return default_metric;
            } catch (e) {
                console.log(e);
            }
        };

        // Add user to gameMetric
        try {
            const heroId = await getUserID();

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/api/metric/${heroId}/${gameId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        metrics: await getDefaultMetric(),
                    }),
                }
            );

            const gameMetric = await res.json();
            console.log(gameMetric.metrics);

            const userMetric = {
                gameMetric: [
                    {
                        metrics: gameMetric.metrics,
                    },
                ],
            };

            return userMetric;
        } catch (e) {
            console.log(e);
        }
    };

    const metric = await getGameMetric();
    // const metric2 = await getGameMetric();

    const user = await getUserMetric();

    return { metric: metric, user: user };
}
