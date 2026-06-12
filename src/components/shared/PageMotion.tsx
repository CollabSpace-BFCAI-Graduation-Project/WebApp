"use client";

"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

interface PageMotionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageMotion({ children, className }: PageMotionProps) {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasHydrated(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!hasHydrated) {
    return <div className={cn(className)}>{children}</div>;
  }

  const initial = { opacity: 0, y: 20 };
  const animate = { opacity: 1, y: 0 };
  const exit = { opacity: 0, y: -20 };
  const transition = { duration: 0.3, ease: "easeOut" as const };

  return (
    <motion.div
      className={cn(className)}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
