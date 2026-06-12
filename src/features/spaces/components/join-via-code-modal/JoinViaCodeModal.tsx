"use client";
import { TooltippedButton } from "@/components/shared/tooltippedButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinkIcon } from "@/components/ui/link";
import { refetchUserSpaces } from "@/features/spaces/query-utils";
import { parseInviteInput } from "@/features/spaces/invite-input";
import { useTab } from "@/features/spaces/hooks/useTab";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useJoinSpaceViaCode } from "../../hooks/useJoinViaCode";

export function JoinViaCodeModal() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [, setTab] = useTab();
  
  const { mutate: joinWithCode, isPending } = useJoinSpaceViaCode();

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setCode("");
      setErrorMsg(null);
    }
  };

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
        ]);

        if (parsedInvite.spaceId) {
          router.push(`/spaces/${parsedInvite.spaceId}`);
        } else {
          router.push("/");
        }

        setOpen(false);
        setCode("");
      },
      onError: (error) => {
        setErrorMsg(
          error instanceof Error ? error.message : "Unable to join with that code."
        );
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <TooltippedButton
        tooltip="Join via Code"
        variant="outline"
        hideTooltipBreakpoint="sm"
        onClick={() => setOpen(true)}
      >
        <LinkIcon className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline-block">Join via Code</span>
      </TooltippedButton>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="space-y-5">
          <div className="w-full flex items-center justify-center">
            <LinkIcon className="w-8 h-8 text-primary hover:text-primary/80 transition-all duration-300" />
          </div>
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-center">Join a Space</DialogTitle>
            <DialogDescription className="text-center">
              Enter the invite code from a shared link. This is not the same as
              the space&apos;s display code.
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Invite Code
              </Label>
              <Input
                id="link"
                placeholder="ABC or paste an invite link"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setErrorMsg(null);
                }}
                maxLength={200}
              />
            </div>
          </div>
          {errorMsg && (
            <p className="text-sm font-medium text-destructive">{errorMsg}</p>
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            className="w-full group cursor-pointer"
            disabled={!code.trim() || isPending}
            onClick={handleJoin}
          >
            {isPending ? "Joining..." : "Join Space"}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
