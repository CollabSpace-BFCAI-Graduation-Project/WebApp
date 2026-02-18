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
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
