import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED_PREFIXES = ["/spaces", "/chat", "/team", "/settings", "/dashboard"];
// The root "/" redirects to dashboard, also protected
const PROTECTED_EXACT = ["/"];

// Routes that are only for unauthenticated users (redirect away if logged in)
const AUTH_ROUTES = ["/login", "/register"];

const AUTH_COOKIE = "auth-token";

function isProtected(pathname: string): boolean {
  if (PROTECTED_EXACT.includes(pathname)) return true;
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  // Authenticated user trying to visit login/register → send them home
  if (isAuthRoute(pathname) && token) {
    const returnTo = request.nextUrl.searchParams.get("returnTo");
    const destination = getSafeReturnTo(returnTo);
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Unauthenticated user trying to visit a protected route → send to login
  if (isProtected(pathname) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

function getSafeReturnTo(returnTo: string | null): string {
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return "/";
  }
  return returnTo;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - api routes (let them through for cookie management)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
