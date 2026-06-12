"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { Button } from "../ui/button";
import { fadeInUp } from "@/lib/animations";

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
    <motion.div
      className="flex flex-col items-center justify-center h-screen gap-4"
      initial={fadeInUp.initial}
      animate={fadeInUp.animate}
      transition={fadeInUp.transition}
    >
      <h1 className="text-2xl font-bold">Something went wrong!</h1>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={handleReload}>Reload</Button>
    </motion.div>
  );
};
