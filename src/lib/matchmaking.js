import { RunAlgo } from "@/lib/generic_shooter_Algo";

const getGameMetrics = async (params) => {
    try {
        const { gameId, userId } = params;

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/match/${userId}/${gameId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const players = await res.json();

        return players;
    } catch (error) {
        console.log(error);
    }
};

const getUserMetric = async (params) => {
    try {
        const { userId } = params;

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/match/${userId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const player = await res.json();

        return player;
    } catch (error) {
        console.log(error);
    }
};

const getParameters = async (params) => {
    try {
        const { gameId } = params;

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

        const metric = game.game[0].default_metric;

        return metric;
    } catch (error) {
        console.log(error);
    }
};

const mergeMetricsWithTemplate = (playerMetrics, template) => {
    const merged = {};

    // Iterate over each key in the template (e.g., Rank, Roles, Game Mode, Communication)
    for (const key in template) {
        if (template.hasOwnProperty(key)) {
            if (typeof template[key] === "object" && template[key] !== null) {
                // If the template key is an object, merge recursively
                merged[key] = {
                    ...template[key], // Default values
                    ...playerMetrics[key], // Player-specific overrides
                };
            } else {
                // For simple values like Rank, use player value or fallback to template
                merged[key] = playerMetrics[key] || template[key];
            }
        }
    }

    return merged;
};

export async function matchmakingAlgo(params) {
    console.log("STARTING");
    const { gameId, userId } = params;

    console.log(`Getting all gameMetrics from game ${gameId}`);
    console.log(`Matching players to ${userId}`);

    const players = await getGameMetrics(params);
    const player = await getUserMetric({ userId: userId });

    const template = await getParameters({ gameId: gameId });

    const filter = players.gameMetric.map((player, index) => {
        const name = `${player.first_name} ${player.last_name}`;

        const mergedMetrics = mergeMetricsWithTemplate(
            player.metrics,
            template
        );

        return {
            name,
            ...mergedMetrics,
        };
    });

    const filterUser = player.gameMetric.map((player, index) => {
        const name = `${player.first_name} ${player.last_name}`;

        const mergedMetrics = mergeMetricsWithTemplate(
            player.metrics,
            template
        );

        return {
            name,
            ...mergedMetrics,
        };
    });

    console.log(filter);
    console.log(filterUser);

    await RunAlgo({ player: filterUser, players: filter });

    return <h1>?</h1>;
}
