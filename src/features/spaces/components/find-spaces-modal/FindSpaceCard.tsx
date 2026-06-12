import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Dot, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import type { Space } from "@/lib/types/api-types";

import { getInitials, getSpaceMemberCount } from "../space-details/space-utils";

interface FindSpaceCardProps {
  space: Space;
  onOpen: () => void;
}

export const FindSpaceCard = ({
  space,
  onOpen,
}: FindSpaceCardProps) => {
  const reduceMotion = useReducedMotion();
  const memberCount = getSpaceMemberCount(space);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg p-4 gap-4"
    >
      <div className="min-w-0 flex items-center gap-2">
        <Avatar>
          <AvatarFallback>{getInitials(space.owner?.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-sm sm:text-base">{space.name}</h3>
          <div className="flex flex-col gap-0.5 pl-0.5">
            <p className="line-clamp-1 text-xs sm:text-sm text-muted-foreground">
              {space.description}
            </p>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>
                  {memberCount} member
                  {memberCount === 1 ? "" : "s"}
                </span>
              </span>
              <Dot />
              <span className="truncate">
                By {space.owner?.name ?? "Unknown"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <Link
          href={`/spaces/${space.id}`}
          className={buttonVariants({
            variant: "default",
            className: "group cursor-pointer size-sm sm:size-default",
          })}
          onClick={onOpen}
        >
          View
        </Link>
      </div>
    </motion.div>
  );
};
