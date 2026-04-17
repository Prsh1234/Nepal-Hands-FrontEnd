import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCircle2, Heart, Users, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type NotificationType = "approval" | "donation" | "volunteer" | "alert";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "approval",
    title: "Campaign Approved",
    description: "Your campaign 'Rebuild Sindhupalchok School' is now live.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "donation",
    title: "New Donation Received",
    description: "Anjali Sharma donated NPR 5,000 to your campaign.",
    time: "15 min ago",
    read: false,
  },
  {
    id: "3",
    type: "volunteer",
    title: "New Volunteer Signed Up",
    description: "Bikash Thapa applied for 'Tree Planting Drive Pokhara'.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "4",
    type: "donation",
    title: "Milestone Reached",
    description: "Your campaign hit 50% of its NPR 500,000 goal!",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "alert",
    title: "Verification Required",
    description: "Please upload remaining documents for transparency badge.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "6",
    type: "volunteer",
    title: "Volunteer Roster Updated",
    description: "3 new volunteers confirmed for 'Flood Relief Chitwan'.",
    time: "2 days ago",
    read: true,
  },
];

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; bg: string }> = {
  approval: { icon: CheckCircle2, color: "text-secondary", bg: "bg-secondary/10" },
  donation: { icon: Heart, color: "text-primary", bg: "bg-primary/10" },
  volunteer: { icon: Users, color: "text-secondary", bg: "bg-secondary/10" },
  alert: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center rounded-full text-[10px] font-bold"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 sm:w-96 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <h3 className="font-display font-semibold text-foreground">Notifications</h3>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="h-8 text-xs">
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {notifications.map((n) => {
                const cfg = typeConfig[n.type];
                const Icon = cfg.icon;
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => markRead(n.id)}
                      className={cn(
                        "w-full text-left px-4 py-3 flex gap-3 hover:bg-muted/50 transition-colors",
                        !n.read && "bg-muted/30"
                      )}
                    >
                      <div className={cn("h-9 w-9 rounded-full flex items-center justify-center shrink-0", cfg.bg)}>
                        <Icon className={cn("h-4 w-4", cfg.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-foreground truncate">
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {n.description}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1">{n.time}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
        <div className="px-4 py-2 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
            <Link to="/notifications">View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
