import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  BadgeCheck,
  Flag,
  Users,
  BarChart3,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Approvals", url: "/admin/approvals", icon: Clock },
  { title: "KYC", url: "/admin/kyc", icon: BadgeCheck },
  { title: "Flagged", url: "/admin/flagged", icon: Flag },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Transactions", url: "/admin/transactions", icon: BarChart3 },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b">
        {!collapsed ? (
          <div>
            <p className="text-xs text-muted-foreground">Admin</p>
            <p className="font-heading font-semibold text-foreground">Dashboard</p>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary font-bold">
            A
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Moderation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = item.end ? pathname === item.url : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink to={item.url} end={item.end} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}