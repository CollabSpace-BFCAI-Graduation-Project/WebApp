/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import type { Space } from "@/lib/types/api-types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  getCategoryGradientClass,
  normalizeCategory,
} from "@/features/spaces/components/space-details/space-utils";
import { fadeInUp, hoverLift, tapScale } from "@/lib/animations";

interface ChatCardProps {
  space: Space;
}

export const ChatCard = ({ space }: ChatCardProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : (fadeInUp.initial as any)}
      animate={reduceMotion ? undefined : (fadeInUp.animate as any)}
      exit={reduceMotion ? undefined : (fadeInUp.exit as any)}
      transition={fadeInUp.transition as any}
      whileHover={reduceMotion ? undefined : (hoverLift as any)}
      whileTap={reduceMotion ? undefined : (tapScale as any)}
    >
      <Link
      href={`/chat/${space.id}`}
      className="border p-5 rounded-xl flex items-center justify-between cursor-pointer bg-secondary hover:bg-secondary/80 transition duration-300 group hover:-translate-0.5"
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            getCategoryGradientClass(space.category),
            "w-10 aspect-square rounded-xl",
          )}
        ></div>
        <div className="flex min-w-0 flex-col">
          <h2 className="font-semibold group-hover:text-primary transition duration-300">
            {space.name}
          </h2>
          <p className="text-muted-foreground text-sm capitalize">
            {normalizeCategory(space.category)}
          </p>
        </div>
      </div>
      <ArrowRight className="opacity-0 -translate-x-3 group-hover:opacity-100 transition duration-300 group-hover:translate-0 size-5" />
    </Link>
    </motion.div>
  );
};
