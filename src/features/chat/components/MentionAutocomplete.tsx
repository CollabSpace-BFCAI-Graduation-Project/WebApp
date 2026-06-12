"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import type { MemberDto, UserSummaryDto } from "@/lib/types/api-types";
import { getInitials } from "@/features/spaces/components/space-details/space-utils";
import { cn } from "@/lib/utils";

interface MentionUser {
  id: string;
  username: string;
  displayName: string | null;
}

interface MentionAutocompleteProps {
  members: MentionUser[];
  query: string;
  isOpen: boolean;
  onSelect: (user: MentionUser) => void;
  onClose: () => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export function MentionAutocomplete({
  members,
  query,
  isOpen,
  onSelect,
  onClose,
  containerRef,
}: MentionAutocompleteProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const currentUser = useAuthStore((s) => s.user);

  const filtered = query
    ? members.filter((m) => {
        if (currentUser && m.id === currentUser.id) return false;
        const q = query.toLowerCase();
        return (
          m.username.toLowerCase().includes(q) ||
          (m.displayName ?? "").toLowerCase().includes(q)
        );
      })
    : members.filter((m) => currentUser && m.id !== currentUser.id);

  const resetIndex = useCallback(() => setActiveIndex(0), []);

  useEffect(() => {
    if (!isOpen) return;
    resetIndex();
  }, [query, isOpen, resetIndex]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || filtered.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % filtered.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
          break;
        case "Enter":
        case "Tab":
          e.preventDefault();
          if (filtered[activeIndex]) {
            onSelect(filtered[activeIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [isOpen, filtered, activeIndex, onSelect, onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, isOpen]);

  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const active = listRef.current.children[activeIndex] as HTMLElement | undefined;
    if (active) {
      active.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, isOpen]);

  if (!isOpen || filtered.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 z-50 mb-1">
      <div
        ref={listRef}
        className="mx-2 max-h-48 overflow-y-auto rounded-lg border bg-popover p-1 shadow-md"
      >
        {filtered.map((user, index) => (
          <button
            key={user.id}
            type="button"
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-left",
              index === activeIndex
                ? "bg-accent text-accent-foreground"
                : "text-popover-foreground hover:bg-accent hover:text-accent-foreground",
            )}
            onClick={() => onSelect(user)}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted-foreground/20 text-[10px] font-medium">
              {getInitials(user.username)}
            </span>
            <span className="font-medium">@{user.username}</span>
            {user.displayName && (
              <span className="text-muted-foreground">{user.displayName}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
