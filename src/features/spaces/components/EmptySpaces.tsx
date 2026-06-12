"use client";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { LayoutPanelTopIcon } from "@/components/ui/layout-panel-top";
import { useCreateSpaceFormStore } from "@/store/create-space-form";
import { fadeInUp } from "@/lib/animations";
import { useMounted } from "@/hooks/useMounted";

export function EmptySpaces() {
  const setIsOpen = useCreateSpaceFormStore((state) => state.setIsOpen);
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="border border-dashed rounded-xl">
        <Empty className="border-none">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LayoutPanelTopIcon />
            </EmptyMedia>
            <EmptyTitle>No spaces found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your filters or create a new one!
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
              Create Space
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <motion.div
      className="border border-dashed rounded-xl"
      initial={fadeInUp.initial}
      animate={fadeInUp.animate}
      transition={fadeInUp.transition}
    >
      <Empty className="border-none">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LayoutPanelTopIcon />
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
            onClick={() => setIsOpen(true)}
          >
            Create Space
          </Button>
        </EmptyContent>
      </Empty>
    </motion.div>
  );
}
