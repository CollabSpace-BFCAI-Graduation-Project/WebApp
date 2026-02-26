"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClockIcon } from "@/components/ui/clock";

export function RequestsSettings() {
  return (
    <Card className="w-full h-full overflow-y-auto pt-4">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <ClockIcon size={22} />
          Pending Join Requests
        </CardTitle>
        <CardDescription>
          Spaces you&apos;ve requested to join, waiting for approval.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center h-36 border border-muted-foreground mx-8 rounded-xl">
        <div className="flex flex-col items-center gap-2">
          <ClockIcon className=" text-muted-foreground" size={28}/>
          <h3 className=" font-semibold text-muted-foreground">
            No pending requests
          </h3>
        </div>
      </CardContent>
    </Card>
  );
}
