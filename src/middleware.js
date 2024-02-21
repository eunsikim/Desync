import { NextResponse } from "next/server";
import { updateSession } from "./lib/auth";

const isLoggedIn = true;

export async function middleware(request){
    // let cookie = request.cookies.get('my-cookie');

    // const isLoggedIn = await updateSession(request);
    
    // if(isLoggedIn){
    //     return NextResponse.next();
    // }
    // return NextResponse.redirect(new URL('/login', request.url));

    return await updateSession(request);
}

export const config = {
    // matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
    matcher: ['/dashboard', '/', '/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};