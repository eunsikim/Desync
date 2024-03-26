import DynamicForm from "./DynamicForm";
import DynamicList from "./DynamicList";

async function getGameMetrics(game) {
    const gameId = game.param;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}api/game/${gameId}`
        );
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const gameData = await response.json();

        return gameData;
    } catch (error) {
        console.error("There was an error fetching the game:", error);
    }
    return {};
}

export default async function ServerComp(gameId) {
    const gameMetric = await getGameMetrics(gameId);

    const MetricsList = ({ data }) => {
        const metrics = data.game[0].metric;

        return <DynamicForm data={[metrics, gameId.param]} />;
    };

    return (
        <>
            <h1>{gameMetric.game[0].title}</h1>
            <DynamicList data={gameId} />
            <h2>Edit metrics</h2>
            <MetricsList data={gameMetric} />
        </>
    );
}
