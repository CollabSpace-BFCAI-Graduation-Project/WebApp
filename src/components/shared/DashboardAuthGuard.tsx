"use client";

interface DashboardAuthGuardProps {
  children: React.ReactNode;
}

/**
 * Auth protection for dashboard routes is handled by middleware (middleware.ts).
 * This component is intentionally a thin pass-through — it exists only as an
 * extension point in case per-page client-side checks are needed in the future.
 */
export function DashboardAuthGuard({ children }: DashboardAuthGuardProps) {
  return children;
}
