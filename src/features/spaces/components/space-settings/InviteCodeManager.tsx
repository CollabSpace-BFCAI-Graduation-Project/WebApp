"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Clock, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CopyToClipboardButton from "@/components/shared/CopyToClipboardButton";
import {
  createInviteCode,
  deleteInviteCode,
  getInviteCodes,
} from "@/features/spaces/services";
import { formatDate } from "../space-details/space-utils";
import type { InviteCode } from "@/lib/types/api-types";

interface InviteCodeManagerProps {
  spaceId: string;
}

type ExpiryOption = "30min" | "1day" | "7days" | "never";
type MaxUsesOption = "1" | "5" | "10" | "unlimited";

const EXPIRY_OPTIONS: { value: ExpiryOption; label: string }[] = [
  { value: "30min", label: "30 minutes" },
  { value: "1day", label: "1 day" },
  { value: "7days", label: "7 days" },
  { value: "never", label: "Never" },
];

const MAX_USES_OPTIONS: { value: MaxUsesOption; label: string }[] = [
  { value: "1", label: "1 use" },
  { value: "5", label: "5 uses" },
  { value: "10", label: "10 uses" },
  { value: "unlimited", label: "Unlimited" },
];

function computeExpiresAt(option: ExpiryOption): string | null {
  if (option === "never") return null;
  const now = new Date();
  switch (option) {
    case "30min":
      now.setMinutes(now.getMinutes() + 30);
      break;
    case "1day":
      now.setDate(now.getDate() + 1);
      break;
    case "7days":
      now.setDate(now.getDate() + 7);
      break;
  }
  return now.toISOString();
}

function computeMaxUses(option: MaxUsesOption): number | null {
  if (option === "unlimited") return null;
  return Number(option);
}

function isExpired(code: InviteCode): boolean {
  return !!code.expiresAt && new Date(code.expiresAt).getTime() < Date.now();
}

function isExhausted(code: InviteCode): boolean {
  return code.maxUses !== null && code.uses >= code.maxUses;
}

export function InviteCodeManager({ spaceId }: InviteCodeManagerProps) {
  const queryClient = useQueryClient();
  const [expiry, setExpiry] = useState<ExpiryOption>("1day");
  const [maxUses, setMaxUses] = useState<MaxUsesOption>("unlimited");

  const { data, isLoading } = useQuery({
    queryKey: ["spaces", spaceId, "invites"],
    queryFn: () => getInviteCodes(spaceId, 1, 50),
  });

  const codes = useMemo(() => data?.data ?? [], [data?.data]);

  const createMutation = useMutation({
    mutationFn: () =>
      createInviteCode(spaceId, {
        maxUses: computeMaxUses(maxUses),
        expiresAt: computeExpiresAt(expiry),
      }),
    onSuccess: async () => {
      toast.success("Invite code generated.");
      await queryClient.invalidateQueries({
        queryKey: ["spaces", spaceId, "invites"],
      });
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Unable to generate invite code.",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (codeId: string) => deleteInviteCode(spaceId, codeId),
    onSuccess: async () => {
      toast.success("Invite code deleted.");
      await queryClient.invalidateQueries({
        queryKey: ["spaces", spaceId, "invites"],
      });
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Unable to delete invite code.",
      );
    },
  });

  const buildInviteUrl = (code: string) =>
    typeof window !== "undefined"
      ? `${window.location.origin}/spaces/${spaceId}?invite=${code}`
      : `/spaces/${spaceId}?invite=${code}`;

  return (
    <div className="space-y-6">
      {/* Generator */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-semibold">Generate a new invite</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Choose how long the link lasts and how many people can use it.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Expires after
            </label>
            <Select value={expiry} onValueChange={(v) => setExpiry(v as ExpiryOption)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPIRY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Max uses
            </label>
            <Select
              value={maxUses}
              onValueChange={(v) => setMaxUses(v as MaxUsesOption)}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MAX_USES_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            disabled={createMutation.isPending}
            onClick={() => createMutation.mutate()}
          >
            <Plus />
            {createMutation.isPending ? "Generating…" : "Generate"}
          </Button>
        </div>
      </div>

      {/* Existing codes */}
      <div>
        <h3 className="mb-2 text-sm font-semibold">Active invite codes</h3>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : codes.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No invite codes yet. Generate one above to start inviting people.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Code</th>
                  <th className="px-4 py-2.5 font-medium">Uses</th>
                  <th className="px-4 py-2.5 font-medium">Expires</th>
                  <th className="w-20 px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {codes.map((code) => {
                  const expired = isExpired(code);
                  const exhausted = isExhausted(code);
                  const inactive = expired || exhausted;
                  const inviteUrl = buildInviteUrl(code.code);
                  return (
                    <tr
                      key={code.id}
                      className={inactive ? "opacity-50" : undefined}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">
                            {code.code}
                          </span>
                          <CopyToClipboardButton textToCopy={inviteUrl} />
                        </div>
                        {inactive && (
                          <Badge variant="secondary" className="mt-1">
                            {expired ? "Expired" : "Exhausted"}
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {code.uses}
                        {code.maxUses !== null ? ` / ${code.maxUses}` : " / ∞"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {code.expiresAt ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3" />
                            {formatDate(code.expiresAt)}
                          </span>
                        ) : (
                          "Never"
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-destructive"
                          disabled={deleteMutation.isPending}
                          title="Delete code"
                          onClick={() => deleteMutation.mutate(code.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
