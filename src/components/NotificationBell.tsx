import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  Heart,
  Users,
  AlertCircle,
  Check,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  Notification,
} from "@/services/notification";

type NotificationType =
  | "approval"
  | "donation"
  | "volunteer"
  | "alert";

const typeConfig: Record<
  NotificationType,
  {
    icon: typeof Bell;
    color: string;
    bg: string;
  }
> = {
  approval: {
    icon: CheckCircle2,
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  donation: {
    icon: Heart,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  volunteer: {
    icon: Users,
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  alert: {
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadNotifications();
  
    const interval = setInterval(loadNotifications, 30000); // every 30 seconds
  
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = async (id: number) => {
    try {
      await markNotificationRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                read: true,
              }
            : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read: true,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center rounded-full text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 sm:w-96 p-0"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h3 className="font-semibold">
              Notifications
            </h3>

            <p className="text-xs text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} unread`
                : "All caught up"}
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllRead}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <ul className="divide-y">
              {notifications.map((n) => {
                const cfg =
                  typeConfig[n.type as NotificationType] ??
                  {
                    icon: Bell,
                    color: "text-primary",
                    bg: "bg-primary/10",
                  };

                const Icon = cfg.icon;

                return (
                  <li key={n.id}>
                    <button
                      onClick={() => markRead(n.id)}
                      className={cn(
                        "w-full px-4 py-3 text-left flex gap-3 hover:bg-muted/50",
                        !n.read && "bg-muted/30"
                      )}
                    >
                      <div
                        className={cn(
                          "h-9 w-9 rounded-full flex items-center justify-center",
                          cfg.bg
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            cfg.color
                          )}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">
                            {n.title}
                          </p>

                          {!n.read && (
                            <span className="h-2 w-2 rounded-full bg-primary mt-2" />
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {n.message}
                        </p>

                        <p className="text-[11px] text-muted-foreground mt-1">
                          {formatDistanceToNow(
                            new Date(n.createdAt),
                            { addSuffix: true }
                          )}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>

        <div className="border-t px-4 py-2">
          <Button
            variant="ghost"
            className="w-full"
            size="sm"
            asChild
          >
            <Link to="/notifications">
              View all notifications
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}