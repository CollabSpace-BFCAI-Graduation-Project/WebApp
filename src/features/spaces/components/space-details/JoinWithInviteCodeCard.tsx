"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseInviteInput } from "../../invite-input";
import { refetchUserSpaces } from "../../query-utils";
import { useTab } from "../../hooks/useTab";
import { useJoinSpaceViaCode } from "../../hooks/useJoinViaCode";

interface JoinWithInviteCodeCardProps {
  spaceId: string;
}

export function JoinWithInviteCodeCard({ spaceId }: JoinWithInviteCodeCardProps) {
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [, setTab] = useTab();
  
  const { mutate: joinWithCode, isPending } = useJoinSpaceViaCode();

  const handleJoin = () => {
    setErrorMsg(null);
    const parsedInvite = parseInviteInput(code);

    if (!parsedInvite?.inviteCode) {
      setErrorMsg("Enter an invite code or paste an invite link.");
      return;
    }

    joinWithCode(parsedInvite.inviteCode, {
      onSuccess: async (response) => {
        toast.success(response.message || "Joined space.");
        await Promise.all([
          setTab("all"),
          refetchUserSpaces(queryClient),
          queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "details", "none"] }),
          queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "member-count"] }),
        ]);
        setCode("");
      },
      onError: (error) => {
        setErrorMsg(
          error instanceof Error
            ? error.message
            : "Invalid or expired invite code."
        );
      },
    });
  };

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <LinkIcon className="size-4 text-primary" />
        Join with invite code
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter the invite code from the space owner or a shared link. Private
        spaces also accept invite codes when shared directly.
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              setErrorMsg(null);
            }}
            placeholder="Invite code or link"
            maxLength={240}
            className="sm:max-w-sm"
          />
          <Button
            type="button"
            disabled={!code.trim() || isPending}
            onClick={handleJoin}
          >
            {isPending ? "Joining..." : "Join as member"}
          </Button>
        </div>
        {errorMsg && (
          <p className="text-sm font-medium text-destructive">{errorMsg}</p>
        )}
      </div>
    </div>
  );
}
