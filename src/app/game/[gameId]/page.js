import ClientComponent from "./clientComponent";
import ServerComponent from "./serverComponent";
import { getUserID } from "@/lib/auth";

export default async function Page({ params }) {
    const s = await ServerComponent(params.gameId);

    const { metric, user } = s;

    return (
        <div>
            <ClientComponent
                param={params.gameId}
                metrico={metric.game[0]?.metric}
                usero={user.gameMetric[0]?.metrics}
            />
        </div>
    );
}
