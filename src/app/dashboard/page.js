"use client";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCardImage,
    MDBBtn,
    MDBRow,
    MDBCol,
} from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function dashboard() {
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

    const GameButton = ({ gameId }) => {
        const fetchGame = async () => {
            router.push(`/game/${gameId}`);
        };

        return <MDBBtn onClick={fetchGame}>SELECT</MDBBtn>;
    };

    return (
        <MDBContainer className="p-4 my-5 d-flex flex-column w-50">
            <h1>Welcome</h1>
            <form
                action={async () => {
                    await logout();
                    redirect("/login");
                }}
            >
                <MDBBtn type="submit">LOGOUT</MDBBtn>
            </form>

            <MDBRow>
                {games.map((game, index) => {
                    return (
                        <MDBCol sm="6" key={index}>
                            <MDBCard>
                                <MDBCardImage
                                    src="https://mdbootstrap.com/img/new/standard/nature/184.webp"
                                    position="top"
                                    alt="..."
                                />
                                <MDBCardBody>
                                    <MDBCardTitle>{game.title}</MDBCardTitle>
                                    <MDBCardText>
                                        {game.description}
                                    </MDBCardText>
                                    <GameButton gameId={game.id} />
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    );
                })}
            </MDBRow>
        </MDBContainer>
    );
}
