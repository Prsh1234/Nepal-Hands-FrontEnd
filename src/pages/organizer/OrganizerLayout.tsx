import { Outlet, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizerSidebar } from "@/components/OrganizerSidebar";
import { Button } from "@/components/ui/button";
import { Plus, HandHeart, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getOrganizerData } from "@/services/userService";

const OrganizerLayout = () => {
  const[organizer, setOrganizer] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const organizerData = await getOrganizerData();

            setOrganizer(organizerData);
        } catch (error) {
            console.error(error);
        }
    };

    fetchUser();
}, []);
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <OrganizerSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b px-4 bg-background sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                ← Back to Nepal Hands
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 mr-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                {organizer?.avatar ? (
                        <img
                          src={`data:image/jpeg;base64,${organizer?.avatar}`}
                          alt={`${organizer?.name} `}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        `${organizer?.name?.charAt(0).toUpperCase() ?? ""}`
                      )}
                </div>
                <div className="text-xs leading-tight">
                  <div className="flex items-center gap-1 font-medium text-foreground">
                    {organizer?.name}
                  </div>
                </div>
              </div>
              <Button size="sm" asChild>
                <Link to="/create">
                  <Plus className="w-4 h-4 mr-1" /> Campaign
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link to="/volunteer/create">
                  <HandHeart className="w-4 h-4 mr-1" /> Opportunity
                </Link>
              </Button>
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

export default OrganizerLayout;
