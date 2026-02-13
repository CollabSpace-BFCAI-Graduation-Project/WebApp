"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock } from "lucide-react";

export function RequestsSettings() {
  return (
    <Card className="w-full h-full">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Pending Join Requests
        </CardTitle>
        <CardDescription>
          Spaces you&apos;ve requested to join, waiting for approval.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center h-36 border border-muted-foreground mx-8 rounded-xl">
        <div className="flex flex-col items-center gap-2">
          <Clock className="w-8 h-8 text-muted-foreground" />
          <h3 className=" font-semibold text-muted-foreground">
            No pending requests
          </h3>
        </div>
      </CardContent>
    </Card>
  );
}
