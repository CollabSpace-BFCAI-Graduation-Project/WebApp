import { AppSidebar } from "@/components/layout/app-sidebar/AppSidebar";
import { NavSidebarTrigger } from "@/components/layout/app-sidebar/AppSidebarTrigger";
import { DashboardAuthGuard } from "@/components/shared/DashboardAuthGuard";
import { PageMotion } from "@/components/shared/PageMotion";
import { SidebarProvider } from "@/components/ui/sidebar";
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
    <DashboardAuthGuard>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <PageMotion className="flex-1 px-4">
          <div className="flex items-center py-2 md:hidden">
            <NavSidebarTrigger />
          </div>
          {children}
        </PageMotion>
      </SidebarProvider>
    </DashboardAuthGuard>
  );
}
