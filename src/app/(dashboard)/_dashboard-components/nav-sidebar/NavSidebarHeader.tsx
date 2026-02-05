"use client";
import { AnimatedLogo } from "@/components/shared/AnimatedLogo";
import { SidebarHeader } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const NavSidebarHeader = () => {
  const { open } = useSidebar();
  return (
    <SidebarHeader>
      <Link
        href="/"
        className="flex flex-row justify-center items-center gap-2 mb-6"
      >
        <AnimatedLogo className="h-10 w-10 mb-0.5 p-2 ml-1.5" />
        <h1
          className={cn(
            "transition-all duration-200 overflow-hidden",
            "text-2xl font-extrabold italic",
            open ? "opacity-100 max-w-auto" : "opacity-0 max-w-0",
          )}
        >
          CollabSpace
        </h1>
      </Link>
    </SidebarHeader>
  );
};
