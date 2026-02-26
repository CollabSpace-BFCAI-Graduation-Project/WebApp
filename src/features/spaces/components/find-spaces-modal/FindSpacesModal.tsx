"use client";
import { TooltippedButton } from "@/components/shared/tooltippedButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { SearchInput } from "../filters/SearchInput";
import { FindSpaceCard } from "./FindSpaceCard";
import { Separator } from "@/components/ui/separator";
import { EarthIcon } from "@/components/ui/earth";

export function FindSpacesModal() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltippedButton
          tooltip="Find Spaces"
          variant="default"
          hideTooltipBreakpoint="sm"
          onClick={() => setOpen(true)}
        >
          <EarthIcon className="w-4 h-4 group-hover:rotate-180 transition-all duration-300" />
          <span className="hidden sm:inline-block">Find Spaces</span>
        </TooltippedButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-row items-center">
          <EarthIcon className="w-8 h-8 text-primary hover:text-primary/80 transition-all duration-300" />
          <div className="flex flex-col gap-1 mt-1">
            <DialogTitle className="text-left">Public Spaces</DialogTitle>
            <DialogDescription className="text-left">
              Find and join new communities
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
          {Array.from({ length: 4 }).map((_, index) => (
            <FindSpaceCard key={index} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
