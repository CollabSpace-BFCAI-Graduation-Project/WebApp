import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { NavSidebar } from "./_dashboard-components/nav-sidebar/NavSidebar";
import { NavSidebarTrigger } from "./_dashboard-components/nav-sidebar/NavSidebarTrigger";

interface SharedLayoutProps {
  children: React.ReactNode;
}
export default function SharedLayout({ children }: SharedLayoutProps) {
  return (
    <SidebarProvider>
      <NavSidebar />
      <SidebarInset>
        <main>
          <NavSidebarTrigger />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
