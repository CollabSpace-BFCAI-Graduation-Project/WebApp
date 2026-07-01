/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  getCategoryGradientClass,
  getSpaceMemberCount,
  normalizeCategory,
} from "./space-details/space-utils";
import { isPrivateSpace } from "../space-membership";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe2, LockKeyhole, Star, Users } from "lucide-react";
import { Space } from "@/lib/types/api-types";
import { resolveBackendMediaUrl } from "@/lib/media-url";
import { useAuthStore } from "@/store/auth-store";
import { useToggleFavorite } from "../hooks/useToggleFavorite";
import { useView } from "../hooks/useView";
import { fadeInUp, hoverLift, tapScale } from "@/lib/animations";

interface Props {
  space: Space;
  isOnline: boolean;
  memberCount?: number;
}

export const SpaceCard = ({ space, isOnline, memberCount: memberCountProp }: Props) => {
  const favMutation = useToggleFavorite();
  const [view] = useView();
  const memberCount = memberCountProp ?? getSpaceMemberCount(space);
  const isPrivate = isPrivateSpace(space);
  const token = useAuthStore((s) => s.token);
  // Thumbnails live behind auth; append the token so the image actually loads.
  const thumbnailUrl = (() => {
    const resolved = resolveBackendMediaUrl(space.thumbnailImageUrl);
    if (!resolved) return null;
    if (!token || !resolved.startsWith("/api/backend-files/")) return resolved;
    return `${resolved}?token=${encodeURIComponent(token)}`;
  })();

  return (
    <motion.div
      initial={fadeInUp.initial as any}
      animate={fadeInUp.animate as any}
      exit={fadeInUp.exit as any}
      transition={fadeInUp.transition as any}
      whileHover={hoverLift as any}
      whileTap={tapScale as any}
    >
      <Link
      href={`/spaces/${space.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:-translate-y-1 hover:shadow-md",
        view === "list" && "sm:flex-row sm:items-stretch sm:h-48",
      )}
    >
      {/* Gradient Area (with optional thumbnail overlay) */}
      <div
        className={cn(
          "relative h-40 w-full p-4 shrink-0",
          getCategoryGradientClass(space.category),
          view === "list" && "sm:h-auto sm:w-56",
        )}
      >
        {thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        )}
        {/* Status Pill (Top Left) */}
        <div className="absolute left-4 top-4">
          <Badge
            variant="secondary"
            className="bg-background/95 font-semibold backdrop-blur hover:bg-background/95"
          >
            {space.isOwner ? "OWNER" : "JOINED"}
          </Badge>
        </div>

        {/* Favorite Button (Top Right) */}
        <div className="absolute right-4 top-4">
          <Button
            type="button"
            size="icon"
            className="size-9 rounded-lg bg-background/95 shadow-sm backdrop-blur transition-transform hover:scale-105 hover:bg-background/95 active:scale-95"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              favMutation.mutate(space.id);
            }}
          >
            <Star
              className={cn(
                "size-4",
                space.isFavorite
                  ? "fill-primary text-primary"
                  : "text-muted-foreground",
              )}
            />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between">
          {/* Category */}
          <Badge
            variant="secondary"
            className="uppercase tracking-wider text-[10px] font-bold"
          >
            {normalizeCategory(space.category)}
          </Badge>

          {/* Privacy/Type Icon */}
          <div
            className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground"
            title={isPrivate ? "Private space" : "Public space"}
          >
            {isPrivate ? (
              <LockKeyhole className="size-3.5" />
            ) : (
              <Globe2 className="size-3.5" />
            )}
          </div>
        </div>

        <h3 className="mb-1.5 flex items-center gap-2 text-xl font-bold tracking-tight transition-colors group-hover:text-primary">
          <span
            className={cn(
              "size-2.5 shrink-0 rounded-full",
              isOnline ? "bg-green-500" : "bg-muted-foreground",
            )}
            title={isOnline ? "Online" : "Offline"}
          />
          <span className="truncate">{space.name}</span>
        </h3>
        <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">
          {space.description}
        </p>

        <div className="my-2 h-px w-full bg-border" />

        <div className="mt-auto flex items-center justify-between text-sm font-medium text-muted-foreground pt-2">
          {memberCount > 0 ? (
            <span className="flex items-center gap-1.5">
              <Users className="size-4" /> {memberCount} member
              {memberCount !== 1 ? "s" : ""}
            </span>
          ) : (
            "No members yet"
          )}
        </div>
      </div>
    </Link>
    </motion.div>
  );
};
