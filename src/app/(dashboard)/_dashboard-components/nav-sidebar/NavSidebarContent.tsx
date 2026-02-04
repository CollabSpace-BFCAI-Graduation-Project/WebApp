import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Grid, Users, MessageSquare, Settings, Bell } from "lucide-react";
import Link from "next/link";

export const NavSidebarContent = () => {
  const navLinks = [
    {
      name: "Spaces",
      url: "/",
      icon: Grid,
    },
    {
      name: "Chat",
      url: "/chat",
      icon: MessageSquare,
    },
    {
      name: "Team",
      url: "/team",
      icon: Users,
    },
  ];

  const navActions = [
    {
      name: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      name: "Notifications",
      url: "/notifications",
      icon: Bell,
    },
  ];
  return (
    <SidebarContent className="flex justify-between">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {navLinks.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {navActions.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};
