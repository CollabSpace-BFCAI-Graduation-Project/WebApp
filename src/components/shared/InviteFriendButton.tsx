"use client";
import { UserPlus, UserRoundCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { sendDirectInvites } from "@/features/spaces/services";
import type { BatchInviteResult } from "@/lib/types/api-types";

interface InviteFriendButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  friendEmail: string;
  setFriendEmail: (email: string) => void;
  spaceId?: string;
}

function normalizeBatchInviteResult(
  result: BatchInviteResult & Record<string, unknown>,
): BatchInviteResult {
  return {
    successfulInvites:
      result.successfulInvites ??
      (result.SuccessfulInvites as BatchInviteResult["successfulInvites"]) ??
      [],
    failedInvites:
      result.failedInvites ??
      (result.FailedInvites as BatchInviteResult["failedInvites"]) ??
      [],
  };
}

const InviteFriendButton = ({
  friendEmail,
  setFriendEmail,
  spaceId,
  ...props
}: InviteFriendButtonProps) => {
  const [isInvited, setIsInvited] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const queryClient = useQueryClient();
  const trimmedEmail = friendEmail.trim();
  const canInvite = trimmedEmail.length > 0;

  const handleInvite = async () => {
    if (!canInvite || !spaceId || isSending) {
      return;
    }

    setIsSending(true);
    try {
      const result = normalizeBatchInviteResult(
        (await sendDirectInvites(spaceId, [trimmedEmail])) as BatchInviteResult &
          Record<string, unknown>,
      );
      const succeeded = result.successfulInvites?.length ?? 0;
      const failed = result.failedInvites ?? [];

      if (succeeded === 0) {
        toast.error(
          failed[0]?.errorMessage ??
            "No invitation was sent. Use a registered username or email.",
        );
        return;
      }

      setIsInvited(true);
      setFriendEmail("");

      if (failed.length > 0) {
        toast.warning(
          `Invitation sent, but ${failed.length} invite${failed.length === 1 ? "" : "s"} failed.`,
        );
      } else {
        toast.success("Invitation sent!");
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["spaces", "direct-invites"] }),
        queryClient.invalidateQueries({ queryKey: ["notifications"] }),
        queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] }),
      ]);

      setTimeout(() => setIsInvited(false), 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to invite user.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleInvite}
      disabled={!canInvite || !spaceId || isSending}
      className="text-muted-foreground cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    >
      {isInvited ? (
        <UserRoundCheck className="w-5! h-5! text-green-500" />
      ) : (
        <UserPlus className="w-5! h-5!" />
      )}
    </button>
  );
};

export default InviteFriendButton;
