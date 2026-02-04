import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { Button } from "../ui/button";

export const ErrorComponent = ({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) => {
  const router = useRouter();

  const handleReload = () => {
    startTransition(() => {
      reset();
      router.refresh();
    });
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Something went wrong!</h1>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={handleReload}>Reload</Button>
    </div>
  );
};
