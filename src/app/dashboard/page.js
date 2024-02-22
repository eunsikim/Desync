'use client'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { logout } from "@/lib/auth"
import { redirect } from "next/navigation";

export default function dashboard(){
    return(
        <main>
            <h1>Welcome</h1>
            <form
                action={async () =>{
                    await logout();
                    redirect('/login');
                }}
            >
                <button type='submit'>LOGOUT</button>
            </form>
        </main>
    )
}