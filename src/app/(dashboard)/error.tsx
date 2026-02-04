"use client";

import { ErrorComponent } from "@/components/shared/ErrorComponent";

export default function DashboardErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorComponent error={error} reset={reset} />;
}
