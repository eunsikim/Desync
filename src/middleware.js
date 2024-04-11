import { NextResponse } from "next/server";
import { updateSession } from "./lib/auth";

export async function middleware(request) {
    return await updateSession(request);
}

export const config = {
    matcher: ["/dashboard", "/((?!|_next/static|_next/image|favicon.ico).*)"], // Removed the `api` because we use `api` route for api calls
};
