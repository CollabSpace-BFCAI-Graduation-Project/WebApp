import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_BASE_URL =
  process.env.BACKEND_API_BASE_URL ?? "http://collabspace-dev.runasp.net/api";

interface RouteContext {
  params: Promise<{
    path: string[];
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const backendOrigin = new URL(BACKEND_API_BASE_URL).origin;
  const targetUrl = new URL(`${backendOrigin}/${path.join("/")}`);

  const token = request.nextUrl.searchParams.get("token");
  request.nextUrl.searchParams.forEach((value, key) => {
    if (key === "token") return;
    targetUrl.searchParams.append(key, value);
  });

  const authHeader = request.headers.get("authorization");
  const headersInit: Record<string, string> = {};
  if (authHeader) {
    headersInit.Authorization = authHeader;
  } else if (token) {
    headersInit.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(targetUrl, {
    headers: headersInit,
  });

  const headers = new Headers(response.headers);
  headers.delete("content-encoding");
  headers.delete("transfer-encoding");

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
