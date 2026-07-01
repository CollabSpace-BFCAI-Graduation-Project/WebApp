"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";

/**
 * Runs once on the client after Zustand rehydrates from localStorage.
 * If the user has a token in localStorage but no cookie (e.g. first load
 * after this feature was deployed, or after a cookie expiry), this will
 * re-sync the cookie so subsequent navigations are protected by middleware.
 */
export function AuthCookieSync() {
  const synced = useRef(false);

  useEffect(() => {
    if (synced.current) return;

    const syncOnHydration = () => {
      if (synced.current) return;
      synced.current = true;

      const { token, isAuthenticated } = useAuthStore.getState();

      if (isAuthenticated && token) {
        fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }).catch(() => {
          // Non-critical
        });
      }
    };

    if (useAuthStore.persist.hasHydrated()) {
      syncOnHydration();
    } else {
      const unsub = useAuthStore.persist.onFinishHydration(syncOnHydration);
      return unsub;
    }
  }, []);

  return null;
}
