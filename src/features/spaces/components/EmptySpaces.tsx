"use client";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { LayoutDashboard } from "lucide-react";
import { useCreateSpaceFormStore } from "@/store/create-space-form";

export function EmptySpaces() {
  const setIsOpen = useCreateSpaceFormStore((state) => state.setIsOpen);
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LayoutDashboard />
        </EmptyMedia>
        <EmptyTitle>No spaces found</EmptyTitle>
        <EmptyDescription>
          Try adjusting your filters or create a new one!
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Create Space
        </Button>
      </EmptyContent>
    </Empty>
  );
}
