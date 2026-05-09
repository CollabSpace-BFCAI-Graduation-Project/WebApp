import { BellIcon } from "@/components/ui/bell";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function NotificationModal() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="
                  data-[active=true]:default-theme:bg-foreground/70
                  data-[active=true]:default-theme:text-background"
          >
            <button>
              <BellIcon size={18} />
              <span>Notifications</span>
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SheetTrigger>
      <SheetContent showCloseButton={false} className="flex flex-col">
        <SheetHeader className="bg-primary/50">
          <SheetTitle className="flex items-center gap-2">
            <BellIcon size={18} /> <span className="text-lg font-bold">Notifications</span>
          </SheetTitle>
          <SheetDescription className="hidden">
            All notifications
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 italic font-semibold items-center justify-center">
          <p className="text-sm text-muted-foreground text-center">
            You have no notifications yet
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
