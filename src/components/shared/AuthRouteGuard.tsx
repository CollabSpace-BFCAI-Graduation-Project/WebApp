"use client";

interface AuthRouteGuardProps {
  children: React.ReactNode;
}

/**
 * Redirecting authenticated users away from login/register is handled by
 * middleware (middleware.ts) before the page renders.
 * This component is a thin pass-through kept for structural consistency.
 */
export function AuthRouteGuard({ children }: AuthRouteGuardProps) {
  return children;
}
