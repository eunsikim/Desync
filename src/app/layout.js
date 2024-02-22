import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <div className={inter.className}>
      {children}
    </div>
  );
  //  Changed the `html` and `body` tag because it was causing:
  //    warning: Did not expect server HTML to contain a <div> in <div>
  //  This seems to have fix that, still not 100% sure why
}