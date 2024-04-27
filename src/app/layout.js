import { Inter } from "next/font/google";
import NavBar from "@/components/navBar";
import "@/app/globals.css";
import { getSession } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Desync",
    description: "A multiplayer game matchmaking application",
};

export default async function RootLayout({ children }) {
    const checkLogin = async () => {
        const session = await getSession();

        if (session != null) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <html>
            <body className={inter.className}>
                <NavBar logged={await checkLogin()} />
                {children}
            </body>
        </html>
    );
}
