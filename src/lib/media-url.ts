const BACKEND_ORIGIN =
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN ?? "http://collabspace-dev.runasp.net";

/** Turn backend media paths into URLs the browser can load in the app. */
export function resolveBackendMediaUrl(url?: string | null): string | undefined {
  if (!url) {
    return undefined;
  }

  if (url.startsWith("/api/backend-files/")) {
    return url;
  }

  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url);
      const backendOrigin = new URL(BACKEND_ORIGIN);

      if (parsed.origin === backendOrigin.origin) {
        return `/api/backend-files${parsed.pathname}${parsed.search}`;
      }
    } catch {
      return url;
    }

    return url;
  }

  const normalizedPath = url.startsWith("/") ? url.slice(1) : url;
  return `/api/backend-files/${normalizedPath}`;
}
