"use client";

import Link from "next/link";
import { Boxes, MessageSquareText, Settings, Share2, UserPlus, Hourglass } from "lucide-react";
import { motion } from "motion/react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SpaceActionsProps {
  spaceId: string;
  isMember: boolean;
  canRequestJoin: boolean;
  hasPendingRequest?: boolean;
  isPublicSpace: boolean;
  isJoining: boolean;
  isRequestingJoin: boolean;
  isInviting: boolean;
  /** Whether the current user may manage this space (Owner/Admin). */
  canManage?: boolean;
  onJoin: () => void;
  onRequestJoin: () => void;
  onInvite: () => void;
}

const motionVariants = {
  container: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
  },
};

export function SpaceActions({
  spaceId,
  isMember,
  canRequestJoin,
  hasPendingRequest,
  isPublicSpace,
  isJoining,
  isRequestingJoin,
  isInviting,
  canManage,
  onJoin,
  onRequestJoin,
  onInvite,
}: SpaceActionsProps) {
  return (
    <motion.div
      className={cn(
        "grid gap-3",
        canManage ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3",
      )}
      variants={motionVariants.container}
      initial="hidden"
      animate="visible"
    >
      {isMember ? (
        <motion.div
          variants={motionVariants.item}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button className="w-full" onClick={onJoin} disabled={isJoining}>
            <Boxes />
            {isJoining ? "Opening..." : "Enter 3D Room"}
          </Button>
        </motion.div>
      ) : hasPendingRequest ? (
        <motion.div
          variants={motionVariants.item}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center justify-center gap-1.5 text-sm text-amber-600 font-medium h-9">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            Pending Approval
          </div>
          <Button 
            className="w-full" 
            variant="outline" 
            disabled
          >
            <Hourglass className="mr-2 size-4 animate-pulse" />
            Pending
          </Button>
        </motion.div>
      ) : canRequestJoin ? (
        <motion.div
          variants={motionVariants.item}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            className="w-full"
            onClick={onRequestJoin}
            disabled={isRequestingJoin}
          >
            <UserPlus />
            {isRequestingJoin ? "Submitting..." : "Request to Join"}
          </Button>
        </motion.div>
      ) : isPublicSpace ? (
        <motion.div
          variants={motionVariants.item}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button className="w-full" variant="secondary" disabled>
            <UserPlus />
            Use invite code to join
          </Button>
        </motion.div>
      ) : (
        <motion.div
          variants={motionVariants.item}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button className="w-full" variant="secondary" disabled>
            <UserPlus />
            Invite required
          </Button>
        </motion.div>
      )}
      <motion.div
        variants={motionVariants.item}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {isMember ? (
          <Link
            href={`/chat/${spaceId}`}
            className={buttonVariants({ variant: "secondary", className: "w-full" })}
          >
            <MessageSquareText />
            Text Chat
          </Link>
        ) : (
          <Button className="w-full" variant="secondary" disabled>
            <MessageSquareText />
            Text Chat
          </Button>
        )}
      </motion.div>
      <motion.div
        variants={motionVariants.item}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          variant="outline"
          className="w-full"
          onClick={onInvite}
          disabled={isInviting || !isMember}
        >
          <Share2 />
          {isInviting ? "Creating..." : "Invite"}
        </Button>
      </motion.div>
      {canManage && (
        <motion.div
          variants={motionVariants.item}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href={`/spaces/${spaceId}/settings`}
            className={buttonVariants({ variant: "outline", className: "w-full" })}
          >
            <Settings />
            Settings
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
