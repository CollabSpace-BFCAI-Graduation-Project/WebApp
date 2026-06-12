"use client";

import { useAuthStore } from "@/store/auth-store";

import { CreateSpaceModal } from "../create-space-modal/CreateSpaceModal";
import { FindSpacesModal } from "../find-spaces-modal/FindSpacesModal";
import { JoinViaCodeModal } from "../join-via-code-modal/JoinViaCodeModal";

export const Header = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex flex-col items-center justify-between gap-6 lg:flex-row">
      <div className="flex flex-col items-center gap-2 lg:items-start lg:gap-1">
        <h1 className="text-3xl font-extrabold">My Spaces</h1>
        <p className="text-muted-foreground">
          Welcome back{user?.name ? `, ${user.name}` : ""}!
        </p>
      </div>
      <div className="flex items-center gap-2">
        <FindSpacesModal />
        <JoinViaCodeModal />
        <CreateSpaceModal />
      </div>
    </header>
  );
};
