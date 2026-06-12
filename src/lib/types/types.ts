import { ReactNode } from "react";

export type ThemeColor =
  | "orange"
  | "lime"
  | "indigo"
  | "yellow"
  | "purple"

export interface SidebarLinkItem {
  name: string;
  url: string;
  icon: ReactNode;
}
