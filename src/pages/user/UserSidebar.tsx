import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Home,
  Megaphone,
  HandHeart,
  LayoutDashboard,
  User,
  Bell,
  Mail,
  ShieldCheck,
  PlusCircle,
  BadgeCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { getUserData } from "@/services/userService";


const discover = [
  { title: "Home", url: "/", icon: Home, end: true },
  { title: "Campaigns", url: "/campaigns", icon: Megaphone },
  { title: "Volunteer", url: "/volunteers", icon: HandHeart },
];


const baseAccount = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Invitations", url: "/invitations", icon: Mail },
  { title: "Notifications", url: "/notifications", icon: Bell },
];


const create = [
  { title: "Start Campaign", url: "/create", icon: PlusCircle },
  { title: "Post Opportunity", url: "/volunteer/create", icon: HandHeart },
];


export function UserSidebar() {

  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const { pathname } = useLocation();

  const [user, setUser] = useState<any>(null);


  useEffect(() => {

    const token = localStorage.getItem("AUTH_TOKEN");

    if (!token) {
      setUser(null);
      return;
    }

    getUserData()
      .then(data => setUser(data))
      .catch(() => setUser(null));

  }, []);



  const roles: string[] = user?.roles ?? [];

  const isVolunteer = roles.includes("ROLE_VOLUNTEER");
  const isOrganizer = roles.includes("ROLE_ORGANIZER");
  const isAdmin = roles.includes("ROLE_ADMIN");



  const account = [
    ...(isOrganizer
      ? [
          {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
          },
        ]
      : []),

    ...(isAdmin
      ? [
          {
            title: "Admin Dashboard",
            url: "/admin/dashboard",
            icon: ShieldCheck,
          },
        ]
      : []),
      ...(!isOrganizer
        ? [
            {
              title: "Register as Organizer",
              url: "/kyc",
              icon: BadgeCheck,
            },
          ]
        : []),
    
    ...baseAccount,
  ];



  const renderGroup = (
    label: string,
    items: {
      title: string;
      url: string;
      icon: typeof Home;
      end?: boolean;
    }[],
  ) => (
    <SidebarGroup>
      <SidebarGroupLabel>
        {label}
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>

          {items.map((item) => {

            const active =
              item.end
                ? pathname === item.url
                : pathname === item.url ||
                  pathname.startsWith(item.url + "/");


            return (
              <SidebarMenuItem key={item.title}>

                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.title}
                >

                  <NavLink
                    to={item.url}
                    end={item.end}
                    className="flex items-center gap-2"
                  >

                    <item.icon className="h-4 w-4" />

                    {!collapsed &&
                      <span>{item.title}</span>
                    }

                  </NavLink>

                </SidebarMenuButton>

              </SidebarMenuItem>
            );
          })}

        </SidebarMenu>
      </SidebarGroupContent>

    </SidebarGroup>
  );



  // Not logged in
  if (!user) {
    return null;
  }



  return (
    <Sidebar
      collapsible="icon"
      className="top-16 h-[calc(100svh-4rem)]"
    >

      <SidebarContent className="pt-2">

        {renderGroup(
          "Discover",
          discover
        )}


        {renderGroup(
          "My Account",
          account
        )}



        {
          (isVolunteer || isOrganizer) &&
          renderGroup(
            "Create",
            create
          )
        }


      </SidebarContent>

    </Sidebar>
  );
}