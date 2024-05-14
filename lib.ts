import { SignJWT, jwtVerify } from "jose";
import "server-only";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secret_key = process.env.SECRET_KEY!;
const key = new TextEncoder().encode(secret_key);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 sec from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  if (!input) return null;
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function createSession(userId: string) {
  const expires = new Date(Date.now() + 10 * 1000);
  const session = await encrypt({ userId, expires });

  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
  });
}

export async function updateSession(request: NextRequest) {
  const session = cookies().get("session")?.value;

  if (!session) {
    return null;
  }

  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) {
    return null;
  }

  return await decrypt(session);
}

export function deleteSession() {
  cookies().set("session", "", { expires: new Date(0) });
  // cookies().delete("session");
}
