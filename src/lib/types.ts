import {  ElementType, ReactNode } from "react";

export type ThemeColor =
  | "slack"
  | "caffeine"
  | "ghibli-studio"
  | "valorant"
  | "perplexity";

export interface SidebarLinkItem {
  name: string;
  url: string;
  icon: ReactNode;
}