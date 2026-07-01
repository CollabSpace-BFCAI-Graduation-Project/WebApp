import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "auth-token";
// 7 days in seconds
const MAX_AGE = 7 * 24 * 60 * 60;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { token } = body as { token?: string };

  const cookieStore = await cookies();

  if (token) {
    cookieStore.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });
    return NextResponse.json({ ok: true });
  }

  // No token → clear the cookie (logout)
  cookieStore.delete(AUTH_COOKIE);
  return NextResponse.json({ ok: true });
}
