"use client";

import { useQuery, useQueries } from "@tanstack/react-query";
import { ClockIcon, TriangleAlertIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyJoinRequests } from "@/features/spaces/services";
import { getSpaceById } from "@/features/spaces/services";
import { isJoinRequestPending } from "@/features/spaces/space-membership";

export function RequestsSettings() {
  const { data: joinRequestsData, isLoading, error } = useQuery({
    queryKey: ["my-join-requests"],
    queryFn: () => getMyJoinRequests(),
  });

  const pendingRequests = (joinRequestsData?.data ?? []).filter((r) =>
    isJoinRequestPending(r.status),
  );

  const uniqueSpaceIds = [...new Set(pendingRequests.map((r) => r.spaceId))];

  const spaceQueries = useQueries({
    queries: uniqueSpaceIds.map((spaceId) => ({
      queryKey: ["space", spaceId],
      queryFn: () => getSpaceById(spaceId),
      enabled: !!spaceId,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const spaces = spaceQueries.reduce(
    (acc, query, index) => {
      if (query.data) {
        acc[uniqueSpaceIds[index]] = query.data;
      }
      return acc;
    },
    {} as Record<string, { name: string }>,
  );

  const isSpacesLoading = spaceQueries.some((q) => q.isLoading);

  if (error) {
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
        <CardContent>
          <div className="flex justify-center items-center h-36 border border-dashed mx-8 rounded-xl">
            <div className="flex flex-col items-center gap-2 text-center">
              <TriangleAlertIcon className="text-destructive" size={28} />
              <h3 className="font-semibold">Failed to load requests</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                {error instanceof Error ? error.message : "Unable to load join requests. Please try again."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
      <CardContent>
        {(isLoading || isSpacesLoading) ? (
          <div className="space-y-3 mx-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : pendingRequests.length > 0 ? (
          <div className="space-y-2 mx-8">
            {pendingRequests.map((request) => {
              const space = spaces[request.spaceId];
              return (
                <div
                  key={request.id}
                  className="flex items-center justify-between rounded-xl border p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {space?.name ?? "Unknown Space"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requested {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                    {request.message && (
                      <p className="mt-1 text-xs text-muted-foreground truncate">
                        &ldquo;{request.message}&rdquo;
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center h-36 border border-dashed mx-8 rounded-xl">
            <div className="flex flex-col items-center gap-2">
              <ClockIcon className="text-muted-foreground" size={28} />
              <h3 className="font-semibold text-muted-foreground">
                No pending requests
              </h3>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
