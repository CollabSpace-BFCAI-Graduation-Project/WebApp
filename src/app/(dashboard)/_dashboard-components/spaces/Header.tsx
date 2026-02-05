import { TooltippedButton } from "@/components/shared/tooltippedButton";
import { Globe, Link, Plus } from "lucide-react";

export const Header = () => {
  const user = {
    name: "mohamed",
  };
  return (
    <header className="flex flex-col lg:flex-row gap-6 items-center justify-between">
      <div className="flex flex-col gap-2 lg:gap-1 items-center lg:items-start">
        <h1 className="text-3xl font-extrabold">My Spaces</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}! 👋</p>
      </div>
      <div className="flex items-center gap-2">
        <TooltippedButton
          tooltip="Find Spaces"
          variant="default"
          hideTooltipBreakpoint="sm"
        >
          <Globe className="w-4 h-4 mr-1 group-hover:rotate-180 transition-all duration-300" />
          <span className="hidden sm:inline-block">Find Spaces</span>
        </TooltippedButton>

        <TooltippedButton
          tooltip="Join via Code"
          variant="outline"
          hideTooltipBreakpoint="sm"
        >
          <Link className="w-4 h-4 mr-1 group-hover:rotate-180 transition-all duration-300" />
          <span className="hidden sm:inline-block">Join via Code</span>
        </TooltippedButton>

        <TooltippedButton
          tooltip="Create Space"
          variant="outline"
          hideTooltipBreakpoint="sm"
        >
          <Plus className="w-4 h-4 mr-1 group-hover:rotate-180 transition-all duration-300" />
          <span className="hidden sm:inline-block">Create Space</span>
        </TooltippedButton>
      </div>
    </header>
  );
};
