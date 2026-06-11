import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Input } from "@/components/ui/input";
import { Search, Shield } from "lucide-react";

const AdminLayout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b px-4 bg-background sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                ← Back to Nepal Hands
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm font-heading font-semibold">
                <Shield className="h-4 w-4 text-primary" /> Admin
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-48 sm:w-64 h-9"
                />
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;