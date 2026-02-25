import { LucideIcon } from "lucide-react";

export type ThemeColor =
  | "default"
  | "claude"
  | "clymorphism"
  | "amethyst"
  | "ocean";


export interface SidebarLinkItem {
  name: string;
  url: string;
  icon: LucideIcon;
}