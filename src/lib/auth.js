"use server";
import { cookies } from "next/headers";
import { EncryptJWT, SignJWT, jwtDecrypt, jwtVerify } from "jose";
import { NextResponse } from "next/server";

const key = new TextEncoder().encode(process.env.SECRET_KEY);

export async function encrypt(payload) {
    return await new EncryptJWT(payload)
        .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
        .setIssuedAt()
        .setExpirationTime("1 week")
        .encrypt(key);
}

export async function decrypt(input) {
    const { payload } = await jwtDecrypt(input, key);
    return payload;
}

export async function login(data) {
    const user = data.hero;
    const expires = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000); // Set Cookie expiry to 1 week cuz reasons (?)
    const session = await encrypt({ user, expires });

    cookies().set("session", session, {
        expires,
        httpOnly: true,
        secure: true,
    });
}

export async function logout() {
    cookies().set("session", "", { expires: new Date(0) });
}

export async function updateSession(request) {
    const session = request.cookies.get("session")?.value;

    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    //   console.log(session);
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000); // Set Cookie expiry to 1 week cuz reasons (?)
    const res = NextResponse.next();
    res.cookies.set({
        name: "session",
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });
    return res;
}

export async function getSession() {
    const session = cookies().get("session")?.value;
    if (!session) {
        return null;
    }
    return await decrypt(session);
}

export async function getUserID() {
    const session = cookies().get("session")?.value;
    if (!session) {
        return null;
    }
    const data = await decrypt(session);
    const id = data.user.id;
    return id;
}
