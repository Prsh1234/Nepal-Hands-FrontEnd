import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  HandHeart,
  Users,
  UserCheck,
  Bell,
  Wallet,
  Settings,
  ScrollText,
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
  { title: "Overview", url: "/organizer", icon: LayoutDashboard, end: true },
  { title: "Campaigns", url: "/organizer/campaigns", icon: Megaphone },
  { title: "Volunteer Ops", url: "/organizer/volunteers", icon: HandHeart },
  { title: "Donors", url: "/organizer/donors", icon: Users },
  { title: "Applicants", url: "/organizer/applicants", icon: UserCheck },
  { title: "Campaign Updates", url: "/organizer/campaignUpdates", icon: Bell },
  { title: "Volunteer Updates", url: "/organizer/volunteerUpdates", icon: Bell },
  { title: "Campaign Transparency", url: "/organizer/transparency", icon: ScrollText },
  { title: "Payouts", url: "/organizer/payouts", icon: Wallet },
  { title: "Settings", url: "/organizer/settings", icon: Settings },
];

export function OrganizerSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b">
        {!collapsed ? (
          <div>
            <p className="text-xs text-muted-foreground">Organizer</p>
            <p className="font-heading font-semibold text-foreground">Dashboard</p>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary font-bold">
            O
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
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
