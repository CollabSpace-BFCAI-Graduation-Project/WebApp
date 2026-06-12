"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import type { Space } from "@/lib/types/api-types";
import { cn } from "@/lib/utils";

import { getCategoryGradientClass, normalizeCategory } from "./space-utils";

interface SpaceHeaderProps {
  space: Space;
}

export function SpaceHeader({ space }: SpaceHeaderProps) {
  return (
    <motion.section
      className={cn(
        "relative overflow-hidden rounded-xl p-6 text-white shadow-sm md:p-8",
        getCategoryGradientClass(space.category),
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-black/10" />
      <motion.div
        className="relative z-10 max-w-3xl space-y-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
        >
          <Badge className="border-white/30 bg-white/20 text-white capitalize backdrop-blur">
            {normalizeCategory(space.category)}
          </Badge>
        </motion.div>
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold tracking-normal md:text-4xl">
            {space.name}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-white/85 md:text-base">
            {space.description}
          </p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
