import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserSidebar } from "./UserSidebar";

const UserLayout = () => (
  <SidebarProvider defaultOpen={false}>
    <div className="min-h-screen flex w-full bg-background">
      <UserSidebar />
      <div className="relative flex-1 min-w-0">
        <SidebarTrigger className="absolute left-2 top-[4.5rem] z-40 bg-background/80 backdrop-blur border border-border shadow-sm" />
        <Outlet />
      </div>
    </div>
  </SidebarProvider>
);

export default UserLayout;
