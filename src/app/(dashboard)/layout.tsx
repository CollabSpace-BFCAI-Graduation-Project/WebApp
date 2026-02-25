import { LayoutHeader } from "@/components/layout/app-header/LayoutHeader";
import { AppSidebar } from "@/components/layout/app-sidebar/AppSidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { BreadcrumbProvider } from "@/context/Breadcrumb";

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
      <BreadcrumbProvider>
        <AppSidebar />
        <SidebarInset>
          <LayoutHeader />
          <div className="flex-1 px-4">{children}</div>
        </SidebarInset>
      </BreadcrumbProvider>
    </SidebarProvider>
  );
}
