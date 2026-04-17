import { useMemo, useState } from "react";
import { format, isAfter, isSameDay, startOfDay, subDays } from "date-fns";
import { motion } from "framer-motion";
import {
  Bell,
  CalendarIcon,
  Check,
  CheckCircle2,
  Heart,
  Users,
  AlertCircle,
  Trash2,
  Filter,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type NotificationType = "approval" | "donation" | "volunteer" | "alert";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  date: Date;
  read: boolean;
}

const now = new Date();
const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "approval",
    title: "Campaign Approved",
    description: "Your campaign 'Rebuild Sindhupalchok School' is now live.",
    date: new Date(now.getTime() - 1000 * 60 * 2),
    read: false,
  },
  {
    id: "2",
    type: "donation",
    title: "New Donation Received",
    description: "Anjali Sharma donated NPR 5,000 to your campaign.",
    date: new Date(now.getTime() - 1000 * 60 * 15),
    read: false,
  },
  {
    id: "3",
    type: "volunteer",
    title: "New Volunteer Signed Up",
    description: "Bikash Thapa applied for 'Tree Planting Drive Pokhara'.",
    date: new Date(now.getTime() - 1000 * 60 * 60),
    read: false,
  },
  {
    id: "4",
    type: "donation",
    title: "Milestone Reached",
    description: "Your campaign hit 50% of its NPR 500,000 goal!",
    date: new Date(now.getTime() - 1000 * 60 * 60 * 3),
    read: true,
  },
  {
    id: "5",
    type: "alert",
    title: "Verification Required",
    description: "Please upload remaining documents for transparency badge.",
    date: subDays(now, 1),
    read: true,
  },
  {
    id: "6",
    type: "volunteer",
    title: "Volunteer Roster Updated",
    description: "3 new volunteers confirmed for 'Flood Relief Chitwan'.",
    date: subDays(now, 2),
    read: true,
  },
  {
    id: "7",
    type: "donation",
    title: "Large Donation Received",
    description: "Himalayan Trust donated NPR 50,000 to 'Mountain Health Camp'.",
    date: subDays(now, 4),
    read: true,
  },
  {
    id: "8",
    type: "approval",
    title: "Volunteer Request Approved",
    description: "Your 'Beach Cleanup Janakpur' opportunity is live.",
    date: subDays(now, 7),
    read: true,
  },
  {
    id: "9",
    type: "alert",
    title: "Campaign Ending Soon",
    description: "'Earthquake Relief Gorkha' has 3 days remaining.",
    date: subDays(now, 10),
    read: true,
  },
];

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; bg: string; label: string }> = {
  approval: { icon: CheckCircle2, color: "text-secondary", bg: "bg-secondary/10", label: "Approval" },
  donation: { icon: Heart, color: "text-primary", bg: "bg-primary/10", label: "Donation" },
  volunteer: { icon: Users, color: "text-secondary", bg: "bg-secondary/10", label: "Volunteer" },
  alert: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Alert" },
};

type DateRange = "all" | "today" | "week" | "month" | "custom";

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [typeFilter, setTypeFilter] = useState<"all" | NotificationType>("all");
  const [readFilter, setReadFilter] = useState<"all" | "unread" | "read">("all");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [customDate, setCustomDate] = useState<Date | undefined>();

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (typeFilter !== "all" && n.type !== typeFilter) return false;
      if (readFilter === "unread" && n.read) return false;
      if (readFilter === "read" && !n.read) return false;

      if (dateRange === "today" && !isSameDay(n.date, now)) return false;
      if (dateRange === "week" && !isAfter(n.date, subDays(now, 7))) return false;
      if (dateRange === "month" && !isAfter(n.date, subDays(now, 30))) return false;
      if (dateRange === "custom" && customDate && !isSameDay(n.date, customDate)) return false;

      return true;
    });
  }, [notifications, typeFilter, readFilter, dateRange, customDate]);

  const grouped = useMemo(() => {
    const groups: Record<string, Notification[]> = {};
    filtered.forEach((n) => {
      const day = startOfDay(n.date).toISOString();
      if (!groups[day]) groups[day] = [];
      groups[day].push(n);
    });
    return Object.entries(groups).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    );
  }, [filtered]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const groupLabel = (iso: string) => {
    const d = new Date(iso);
    if (isSameDay(d, now)) return "Today";
    if (isSameDay(d, subDays(now, 1))) return "Yesterday";
    return format(d, "EEEE, MMMM d");
  };

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const remove = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const clearAll = () => setNotifications([]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Notifications
              </h1>
              <p className="text-muted-foreground mt-1">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "You're all caught up"}
              </p>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllRead}>
                  <Check className="h-4 w-4 mr-1" /> Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  <Trash2 className="h-4 w-4 mr-1" /> Clear all
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-xl p-4 mb-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Filter className="h-4 w-4" /> Filters
            </div>

            <Tabs value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="approval">Approvals</TabsTrigger>
                <TabsTrigger value="donation">Donations</TabsTrigger>
                <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
                <TabsTrigger value="alert">Alerts</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select value={readFilter} onValueChange={(v) => setReadFilter(v as typeof readFilter)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="unread">Unread only</SelectItem>
                  <SelectItem value="read">Read only</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={dateRange}
                onValueChange={(v) => {
                  setDateRange(v as DateRange);
                  if (v !== "custom") setCustomDate(undefined);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 days</SelectItem>
                  <SelectItem value="month">Last 30 days</SelectItem>
                  <SelectItem value="custom">Specific date</SelectItem>
                </SelectContent>
              </Select>

              {dateRange === "custom" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !customDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customDate ? format(customDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customDate}
                      onSelect={setCustomDate}
                      disabled={(d) => d > new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          {/* List */}
          {grouped.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border rounded-xl">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <h3 className="font-display text-lg font-semibold text-foreground">
                No notifications found
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {grouped.map(([day, items]) => (
                <div key={day}>
                  <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
                    {groupLabel(day)}
                  </h2>
                  <ul className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
                    {items.map((n) => {
                      const cfg = typeConfig[n.type];
                      const Icon = cfg.icon;
                      return (
                        <li
                          key={n.id}
                          className={cn(
                            "flex gap-3 p-4 hover:bg-muted/40 transition-colors group",
                            !n.read && "bg-muted/20"
                          )}
                        >
                          <div className={cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0", cfg.bg)}>
                            <Icon className={cn("h-5 w-5", cfg.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-sm font-semibold text-foreground">
                                    {n.title}
                                  </p>
                                  <Badge variant="outline" className="text-[10px] py-0 h-4">
                                    {cfg.label}
                                  </Badge>
                                  {!n.read && (
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {n.description}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1.5">
                                  {format(n.date, "p · MMM d, yyyy")}
                                </p>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!n.read && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => markRead(n.id)}
                                    aria-label="Mark as read"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => remove(n.id)}
                                  aria-label="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Notifications;
