import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function AccountInfoCard() {
  const userId = "a0fb3898. . .";
  const memberSince = "29 Jan, 2026";
  return (
    <Card className="w-full gap-3">
      <CardHeader>
        <CardTitle>Account Info</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">User ID</span>
          <span className="font-semibold">{userId}</span>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Member since</span>
          <span className="font-semibold">{memberSince}</span>
        </div>
      </CardContent>
    </Card>
  );
}
