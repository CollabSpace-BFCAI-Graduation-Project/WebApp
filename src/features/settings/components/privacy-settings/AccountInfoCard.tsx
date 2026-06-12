import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Profile } from "@/lib/types/api-types";

interface AccountInfoCardProps {
  profile: Profile;
}

export function AccountInfoCard({ profile }: AccountInfoCardProps) {
  return (
    <Card className="w-full gap-3">
      <CardHeader>
        <CardTitle>Account Info</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">User ID</span>
          <span className="truncate font-semibold">{profile.id}</span>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Email</span>
          <span className="truncate font-semibold">{profile.email}</span>
        </div>
      </CardContent>
    </Card>
  );
}
