"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth-store";

interface AuthRouteGuardProps {
  children: React.ReactNode;
}

export function AuthRouteGuard({ children }: AuthRouteGuardProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [hasHydrated, setHasHydrated] = useState(
    useAuthStore.persist.hasHydrated(),
  );
  const prevIsAuthenticatedRef = useRef(isAuthenticated);

  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const wasUnauthenticated = !prevIsAuthenticatedRef.current;
    const justLoggedIn = wasUnauthenticated && isAuthenticated;
    prevIsAuthenticatedRef.current = isAuthenticated;

    if (!isAuthenticated) {
      return;
    }

    if (justLoggedIn) {
      return;
    }

    const returnTo = getSafeReturnTo(getReturnToParam());
    const currentPath =
      typeof window === "undefined" ? "/" : window.location.pathname;

    if (returnTo === currentPath || returnTo === "/login" || returnTo === "/register") {
      router.replace("/");
      return;
    }

    router.replace(returnTo);
  }, [hasHydrated, isAuthenticated, router]);

  return children;
}

function getReturnToParam() {
  if (typeof window === "undefined") {
    return null;
  }

  return new URLSearchParams(window.location.search).get("returnTo");
}

function getSafeReturnTo(returnTo: string | null) {
  if (!returnTo?.startsWith("/") || returnTo.startsWith("//")) {
    return "/";
  }

  return returnTo;
}
