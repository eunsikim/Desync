"use client";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { MDBContainer } from "mdb-react-ui-kit";

export default function ClientComponent({ children }) {
    return (
        <MDBContainer className="p-4 my-5 d-flex flex-column w-50">
            {children}
        </MDBContainer>
    );
}
