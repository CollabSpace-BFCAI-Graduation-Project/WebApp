"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Profile } from "@/lib/types/api-types";
import { getCurrentProfile, updatePrivacySettings } from "../../services";
import { AccountInfoCard } from "./AccountInfoCard";
import { DeleteAccountCard } from "./DeleteAccountCard";
import { ProfileVisibilityChoiceCardS } from "./ProfileVisibilityChoiceCardS";
import { ShowEmailSwitchCard } from "./ShowEmailSwitchCard";

export function PrivacySettings() {
  const {
    data: profile,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: getCurrentProfile,
  });
  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load privacy settings.",
      );
    }
  }, [error]);

  if (isLoading) {
    return (
      <Card className="h-full w-full overflow-y-auto pt-4">
        <CardContent className="flex flex-col gap-6 overflow-y-auto">
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (error || !profile) {
    return (
      <Card className="h-full w-full overflow-y-auto pt-4">
        <CardContent className="flex min-h-60 items-center justify-center text-center">
          <div>
            <p className="font-medium">Privacy settings unavailable</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Your privacy settings could not be loaded."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <PrivacySettingsForm profile={profile} />;
}

function PrivacySettingsForm({ profile }: { profile: Profile }) {
  const queryClient = useQueryClient();
  const [profileVisibility, setProfileVisibility] = useState(profile.privacy);
  const [showEmail, setShowEmail] = useState(profile.showEmail);
  const updateMutation = useMutation({
    mutationFn: () =>
      updatePrivacySettings({
        profileVisibility,
        showEmail,
      }),
    onSuccess: async () => {
      toast.success("Privacy settings saved.");
      await queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
    onError: (updateError) => {
      toast.error(
        updateError instanceof Error
          ? updateError.message
          : "Unable to save privacy settings.",
      );
    },
  });

  return (
    <Card className="h-full w-full overflow-y-auto pt-4">
      <CardHeader className="sr-only space-y-2">
        <CardTitle className="text-lg font-bold">Privacy Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 overflow-y-auto">
        <div className="rounded-xl border border-muted-foreground p-4">
          <h3 className="font-semibold">Profile Visibility</h3>
          <div className="mt-4 flex flex-col gap-3 p-1">
            <ProfileVisibilityChoiceCardS
              value={profileVisibility}
              onChange={setProfileVisibility}
            />
          </div>
        </div>
        <div className="rounded-xl border border-muted-foreground p-4">
          <div className="p-1">
            <ShowEmailSwitchCard
              checked={showEmail}
              onCheckedChange={setShowEmail}
            />
          </div>
        </div>
        <div className="rounded-xl border border-muted-foreground">
          <AccountInfoCard profile={profile} />
        </div>
        <Button
          className="w-full cursor-pointer font-semibold sm:w-1/3"
          disabled={updateMutation.isPending}
          onClick={() => updateMutation.mutate()}
        >
          <Save />
          {updateMutation.isPending ? "Saving..." : "Save Privacy"}
        </Button>
        <div className="rounded-xl">
          <DeleteAccountCard />
        </div>
      </CardContent>
    </Card>
  );
}
