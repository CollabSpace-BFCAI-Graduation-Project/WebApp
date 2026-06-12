"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Files,
  Globe2,
  LockKeyhole,
  UserRound,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import type { Space, StorageContents } from "@/lib/types/api-types";
import { getSpacePrivacy, isPrivateSpace } from "../../space-membership";
import { updateSpacePrivacy } from "../../services";
import { refetchUserSpaces } from "../../query-utils";
import { syncSpacePrivacyInCache } from "../../space-privacy-sync";
import { formatLongDate, getSpaceMemberCount } from "./space-utils";

interface SpaceAboutSidebarProps {
  space: Space;
  storage: StorageContents;
}

export function SpaceAboutSidebar({ space, storage }: SpaceAboutSidebarProps) {
  const queryClient = useQueryClient();
  const files = storage.files ?? [];
  const links = storage.links ?? [];
  const folders = storage.folders ?? [];
  const fileCount =
    files.length + links.length + folders.length;
  const memberCount = getSpaceMemberCount(space);
  const isOwner = space.isOwner;

  const privacyMutation = useMutation({
    mutationFn: (privacy: "Public" | "Private") =>
      updateSpacePrivacy(space.id, privacy),
    onSuccess: async (response) => {
      toast.success(`Space is now ${response.privacy.toLowerCase()}.`);
      syncSpacePrivacyInCache(queryClient, space.id, response.privacy);
      await refetchUserSpaces(queryClient);
      await queryClient.invalidateQueries({ queryKey: ["spaces", space.id] });
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Unable to update privacy.",
      );
    },
  });

  const currentPrivacy = getSpacePrivacy(space) || "Unknown";

  const rows = [
    { label: "Owner", value: space.owner?.name ?? "Unknown", icon: UserRound },
    { label: "Created", value: formatLongDate(space.createdAt), icon: CalendarDays },
    { label: "Members", value: String(memberCount), icon: Users },
    { label: "Files", value: String(fileCount), icon: Files },
  ];

  const renderRow = (
    row: { label: string; value: string; icon: React.ComponentType<{ className?: string }> },
    index: number,
    total: number,
  ) => (
    <div key={row.label}>
      <div className="flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <row.icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{row.label}</p>
          <p className="truncate text-sm font-medium">{row.value}</p>
        </div>
      </div>
      {index < total - 1 && <Separator className="mt-4" />}
    </div>
  );

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>About Space</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderRow(rows[0], 0, rows.length + 1)}
        {renderRow(rows[1], 1, rows.length + 1)}

        <div key="Visibility">
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              {isPrivateSpace(space) ? <LockKeyhole className="size-4" /> : <Globe2 className="size-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Visibility</p>
              {isOwner ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 truncate text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                    {currentPrivacy}
                    <ChevronDown className="size-3.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      disabled={currentPrivacy.toLowerCase() === "public"}
                      onClick={() => privacyMutation.mutate("Public")}
                    >
                      <Globe2 className="size-4 mr-2" />
                      <span className="flex-1">Public</span>
                      {currentPrivacy.toLowerCase() === "public" && <Check className="size-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={currentPrivacy.toLowerCase() === "private"}
                      onClick={() => privacyMutation.mutate("Private")}
                    >
                      <LockKeyhole className="size-4 mr-2" />
                      <span className="flex-1">Private</span>
                      {currentPrivacy.toLowerCase() === "private" && <Check className="size-4" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <p className="truncate text-sm font-medium">{currentPrivacy}</p>
              )}
            </div>
          </div>
          <Separator className="mt-4" />
        </div>

        {rows.slice(2).map((row, index) =>
          renderRow(row, index + 2, rows.length + 1)
        )}
      </CardContent>
    </Card>
  );
}
