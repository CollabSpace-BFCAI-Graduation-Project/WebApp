import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarLinkItem } from "@/lib/types";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface SidebarLinkProps {
  item: SidebarLinkItem;
}

export const SidebarLink = ({ item }: SidebarLinkProps) => {
  const path = usePathname();
  const router = useRouter();
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={path === item.url || path?.startsWith(`${item.url}/`)}
        className="data-[active=true]:default-theme:bg-foreground/70
                 data-[active=true]:default-theme:text-background"
      >
        <Link
          href={item.url}
          onClick={(e) => {
            if (isMobile) {
              e.preventDefault();
              toggleSidebar();
              router.push(item.url);
            }
          }}
        >
          {item.icon}
          <span>{item.name}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
