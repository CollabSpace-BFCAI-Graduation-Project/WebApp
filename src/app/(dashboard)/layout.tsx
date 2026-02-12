import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { NavSidebar } from "./_dashboard-components/nav-sidebar/NavSidebar";
import { NavSidebarTrigger } from "./_dashboard-components/nav-sidebar/NavSidebarTrigger";
import { cookies } from "next/headers";

interface SharedLayoutProps {
  children: React.ReactNode;
}
export default async function SharedLayout({ children }: SharedLayoutProps) {
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
