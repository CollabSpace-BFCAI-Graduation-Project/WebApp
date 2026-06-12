"use client";

import { motion } from "motion/react";

export const AnimatedLogo = () => {
  return (
    <motion.svg
      animate={{ scale: [1, 1.05, 1] }}
      fill="none"
      height={48}
      transition={{
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
      }}
      viewBox="0 0 48 48"
      width={48}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="hsl(var(--primary))" height={48} rx={12} width={48} />
      <path
        d="M16 32V16l16 16V16"
        stroke="hsl(var(--primary-foreground))"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
      />
    </motion.svg>
  );
};
