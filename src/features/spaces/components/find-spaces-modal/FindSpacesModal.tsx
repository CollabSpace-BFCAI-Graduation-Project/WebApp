"use client";
import { TooltippedButton } from "@/components/shared/tooltippedButton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { SearchInput } from "../filters/SearchInput";
import { FindSpaceCard } from "./FindSpaceCard";
import { Separator } from "@/components/ui/separator";
import { EarthIcon } from "lucide-react";
import { useGetPublicSpaces } from "../../hooks/useGetPublicSpaces";

export function FindSpacesModal() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetPublicSpaces(debouncedSearch || undefined);

  const spaces = data?.pages.flatMap((page) => page.data) ?? [];

  // Sentinel ref for IntersectionObserver
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !open) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, open]);

  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load public spaces.",
      );
    }
  }, [error]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltippedButton
        tooltip="Find Spaces"
        variant="default"
        hideTooltipBreakpoint="sm"
        onClick={() => setOpen(!open)}
      >
        <EarthIcon className="w-4 h-4 group-hover:rotate-180 transition-all duration-300" />
        <span className="hidden sm:inline-block">Find Spaces</span>
      </TooltippedButton>
      <DialogContent>
        <DialogHeader className="flex flex-row items-center">
          <EarthIcon className="w-8 h-8 text-primary hover:text-primary/80 transition-all duration-300" />
          <div className="flex flex-col gap-1 mt-1">
            <DialogTitle className="text-left">Discover Public Spaces</DialogTitle>
            <DialogDescription className="text-left">
              Browse public communities, then join with an invite code from the
              owner.
            </DialogDescription>
          </div>
        </DialogHeader>
        <Separator />
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <SearchInput
              id="search"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Separator />
        <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4 space-y-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24 rounded-lg" />
            ))
          ) : spaces.length ? (
            <>
              {spaces.map((space) => (
                <FindSpaceCard
                  key={space.id}
                  space={space}
                  onOpen={() => setOpen(false)}
                />
              ))}
              
              {isFetchingNextPage &&
                Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={`skeleton-${index}`} className="h-24 rounded-lg" />
                ))}

              {/* Invisible sentinel */}
              <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
            </>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm font-medium">No spaces found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different name or description.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
