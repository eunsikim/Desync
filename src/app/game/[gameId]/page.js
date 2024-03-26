import ClientComp from "./clientComp";
import ServerComp from "./serverComp";

export default function Page({ params }) {
    return (
        <ClientComp>
            <ServerComp param={params.gameId} />
        </ClientComp>
    );
}
