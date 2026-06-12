import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_BASE_URL =
  process.env.BACKEND_API_BASE_URL ?? "http://collabspace-dev.runasp.net/api";

interface RouteContext {
  params: Promise<{
    path: string[];
  }>;
}

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const targetUrl = new URL(`${BACKEND_API_BASE_URL}/${path.join("/")}`);
  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  const contentType = request.headers.get("content-type");
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    const normalizedKey = key.toLowerCase();
    if (
      !["host", "content-length"].includes(normalizedKey) &&
      !(contentType?.includes("multipart/form-data") && normalizedKey === "content-type")
    ) {
      headers[key] = value;
    }
  });

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : contentType?.includes("multipart/form-data")
        ? await request.formData()
        : contentType?.includes("application/json")
          ? await request
              .json()
              .catch(() => request.text())
          : await request.text();

  const config: AxiosRequestConfig = {
    url: targetUrl.toString(),
    method: request.method,
    headers,
    data: body,
    validateStatus: () => true,
  };

  try {
    const response = await axios.request(config);

    const nextResponseHeaders = new Headers();
    if (response.headers) {
      Object.entries(response.headers).forEach(([key, value]) => {
        if (
          !["transfer-encoding", "content-encoding", "content-length"].includes(
            key.toLowerCase(),
          ) &&
          value !== undefined
        ) {
          nextResponseHeaders.set(key, String(value));
        }
      });
    }

    if (
      response.status === 204 ||
      response.status === 205 ||
      request.method === "HEAD"
    ) {
      return new NextResponse(null, {
        status: response.status,
        headers: nextResponseHeaders,
      });
    }

    return NextResponse.json(response.data, {
      status: response.status,
      headers: nextResponseHeaders,
    });
  } catch (error) {
    const status = error instanceof AxiosError ? (error.response?.status ?? 502) : 502;
    const message =
      error instanceof Error ? error.message : "Backend request failed";

    return NextResponse.json({ detail: message }, { status });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
