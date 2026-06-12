import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Space } from "@/lib/types/api-types";
import { getPublicProfiles } from "@/features/spaces/services";

import { getInitials, getSpaceMembersForDisplay } from "./space-utils";

interface SpaceMembersSidebarProps {
  space: Space;
}

export function SpaceMembersSidebar({ space }: SpaceMembersSidebarProps) {
  const safeMembers = getSpaceMembersForDisplay(space);

  const { data: profilesResult } = useQuery({
    queryKey: ["profiles", "members-avatars"],
    queryFn: () => getPublicProfiles(undefined, 1, 100),
    staleTime: 5 * 60 * 1000,
  });

  const profilesMap = new Map<string, string>();
  (profilesResult?.data ?? []).forEach((p) => {
    if (p.avatarImage) {
      profilesMap.set(p.id, p.avatarImage);
    }
  });

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {safeMembers.map((member) => {
            const avatarUrl = profilesMap.get(member.id);
            return (
              <div key={member.id} className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={member.name} />}
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-background bg-emerald-500" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{member.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    @{member.username}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
