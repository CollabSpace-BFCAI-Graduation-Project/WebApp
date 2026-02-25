"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileVisibilityChoiceCardS } from "./ProfileVisibilityChoiceCardS";
import { ShowEmailSwitchCard } from "./ShowEmailSwitchCard";
import { AccountInfoCard } from "./AccountInfoCard";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { DeleteAccountCard } from "./DeleteAccountCard";

export function PrivacySettings() {
  return (
    <Card className="w-full h-full overflow-y-auto pt-4">
      <CardHeader className="space-y-2 sr-only">
        <CardTitle className="text-lg font-bold">Privacy Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 overflow-y-auto">
        <div className="border border-muted-foreground rounded-xl p-4">
          <h3 className="font-semibold">Profile Visibility</h3>
          <div className="flex flex-col gap-3 mt-4 p-1">
            <ProfileVisibilityChoiceCardS />
          </div>
        </div>
        <div className="border border-muted-foreground rounded-xl p-4">
          <div className="p-1">
            <ShowEmailSwitchCard />
          </div>
        </div>
        <div className="border border-muted-foreground rounded-xl opacity-50">
          <AccountInfoCard />
        </div>
        <Button className="w-1/3 cursor-pointer font-semibold">
          <Save className="size-5" /> Save Privacy
        </Button>
        <div className="rounded-xl">
          <DeleteAccountCard />
        </div>
      </CardContent>
    </Card>
  );
}
