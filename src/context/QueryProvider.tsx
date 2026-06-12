"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { useEffect, useState } from "react";

import { useAuthStore } from "@/store/auth-store";
import { signalRClient } from "@/lib/signalr";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const token = useAuthStore((state) => state.token);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 30_000,
          },
        },
      }),
  );

  useEffect(() => {
    queryClient.clear();
  }, [queryClient, token]);

  useEffect(() => {
    let mounted = true;

    const initSignalR = async () => {
      if (token && mounted) {
        try {
          await signalRClient.connect();
        } catch (error) {
          console.error("Failed to initialize SignalR:", error);
        }
      }
    };

    const cleanupSignalR = async () => {
      if (!token) {
        await signalRClient.disconnect();
      }
    };

    initSignalR();
    cleanupSignalR();

    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
