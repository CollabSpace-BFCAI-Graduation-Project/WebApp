import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { NavSidebar } from "@/components/layout/nav-sidebar/NavSidebar";
import { NavSidebarTrigger } from "@/components/layout/nav-sidebar/NavSidebarTrigger";
import { cookies } from "next/headers";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <NavSidebar />
      <SidebarInset>
        <NavSidebarTrigger />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
