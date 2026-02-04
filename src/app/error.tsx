"use client";

import { ErrorComponent } from "@/components/shared/ErrorComponent";

export default function RootErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorComponent error={error} reset={reset} />;
}
