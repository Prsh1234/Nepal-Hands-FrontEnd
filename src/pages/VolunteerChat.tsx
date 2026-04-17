import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Smile,
  Users,
  MapPin,
  Calendar,
  Pin,
  MoreVertical,
  Image as ImageIcon,
  CheckCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getVolunteerById } from "@/data/volunteers";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  author: string;
  role: string;
  text: string;
  date: Date;
  isMe?: boolean;
  isOrganizer?: boolean;
  system?: boolean;
}

const seedMessages = (orgName: string): ChatMessage[] => {
  const now = new Date();
  const h = (n: number) => new Date(now.getTime() - n * 60 * 60 * 1000);
  const m = (n: number) => new Date(now.getTime() - n * 60 * 1000);
  return [
    {
      id: "s1",
      author: "System",
      role: "",
      text: "Group chat created for this volunteer activity.",
      date: h(48),
      system: true,
    },
    {
      id: "1",
      author: "Anjali Sharma",
      role: "Organizer",
      text: `Namaste team! Welcome to the official chat for our ${orgName} activity. Please introduce yourselves 🙏`,
      date: h(47),
      isOrganizer: true,
    },
    {
      id: "2",
      author: "Bikash Thapa",
      role: "Volunteer",
      text: "Hi everyone! I'm Bikash from Kathmandu, excited to help out.",
      date: h(46),
    },
    {
      id: "3",
      author: "Sushmita Rai",
      role: "Volunteer",
      text: "Hello! Sushmita here, traveling from Pokhara. Is there a packing list?",
      date: h(45),
    },
    {
      id: "4",
      author: "Anjali Sharma",
      role: "Organizer",
      text: "Great question! I've pinned the packing list and meeting point above. Please bring water, sunscreen, and comfortable shoes.",
      date: h(44),
      isOrganizer: true,
    },
    {
      id: "5",
      author: "Ramesh KC",
      role: "Volunteer",
      text: "Can someone share rides from Thamel? I have space for 3 in my car.",
      date: h(20),
    },
    {
      id: "6",
      author: "You",
      role: "Volunteer",
      text: "I'd love to join the carpool from Thamel, thanks Ramesh!",
      date: h(19),
      isMe: true,
    },
    {
      id: "7",
      author: "Anjali Sharma",
      role: "Organizer",
      text: "Reminder: please arrive by 7:00 AM tomorrow. Breakfast will be provided on-site.",
      date: m(45),
      isOrganizer: true,
    },
    {
      id: "8",
      author: "Bikash Thapa",
      role: "Volunteer",
      text: "Thanks for organizing this! See everyone tomorrow 💪",
      date: m(8),
    },
  ];
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const colorFromName = (name: string) => {
  const palette = [
    "bg-primary/15 text-primary",
    "bg-secondary/15 text-secondary",
    "bg-accent/30 text-accent-foreground",
    "bg-muted text-foreground",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % palette.length;
  return palette[h];
};

const VolunteerChat = () => {
  const { id } = useParams();
  const opportunity = getVolunteerById(id || "");
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    seedMessages(opportunity?.title || "this opportunity")
  );
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const grouped = useMemo(() => {
    const out: { day: Date; items: ChatMessage[] }[] = [];
    messages.forEach((m) => {
      const last = out[out.length - 1];
      if (last && isSameDay(last.day, m.date)) last.items.push(m);
      else out.push({ day: m.date, items: [m] });
    });
    return out;
  }, [messages]);

  if (!opportunity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Activity Not Found</h1>
        <Link to="/volunteers">
          <Button variant="outline">
            <ArrowLeft size={16} className="mr-2" /> Back to Volunteers
          </Button>
        </Link>
      </div>
    );
  }

  const memberCount = opportunity.spotsFilled + 1;

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        author: "You",
        role: "Volunteer",
        text,
        date: new Date(),
        isMe: true,
      },
    ]);
    setDraft("");
  };

  const dayLabel = (d: Date) => {
    const today = new Date();
    if (isSameDay(d, today)) return "Today";
    const y = new Date();
    y.setDate(y.getDate() - 1);
    if (isSameDay(d, y)) return "Yesterday";
    return format(d, "EEEE, MMMM d");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-6 flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl w-full mx-auto flex-1 flex flex-col"
        >
          {/* Back */}
          <Link
            to={`/volunteer/${opportunity.id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft size={16} /> Back to opportunity
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 flex-1 min-h-0">
            {/* Chat panel */}
            <div className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden min-h-[70vh]">
              {/* Header */}
              <div className="flex items-center justify-between gap-3 p-4 border-b border-border bg-card">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold shrink-0">
                    {initials(opportunity.title)}
                  </div>
                  <div className="min-w-0">
                    <h1 className="font-display text-lg font-bold text-foreground truncate">
                      {opportunity.title}
                    </h1>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" /> {memberCount} members
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                      <span className="inline-flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-secondary" /> 4 online
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* Pinned */}
              <div className="px-4 py-2.5 bg-accent/30 border-b border-border flex items-start gap-2">
                <Pin className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <div className="text-xs text-foreground">
                  <span className="font-semibold">Meeting point:</span> {opportunity.location} ·{" "}
                  <span className="font-semibold">Start:</span>{" "}
                  {format(new Date(opportunity.startDate), "MMM d, p")}
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1" ref={scrollRef as never}>
                <div className="p-4 space-y-6">
                  {grouped.map((g, gi) => (
                    <div key={gi} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Separator className="flex-1" />
                        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                          {dayLabel(g.day)}
                        </span>
                        <Separator className="flex-1" />
                      </div>

                      {g.items.map((msg) => {
                        if (msg.system) {
                          return (
                            <div key={msg.id} className="text-center">
                              <span className="text-xs text-muted-foreground bg-muted/60 px-3 py-1 rounded-full">
                                {msg.text}
                              </span>
                            </div>
                          );
                        }
                        return (
                          <div
                            key={msg.id}
                            className={cn(
                              "flex gap-3",
                              msg.isMe && "flex-row-reverse"
                            )}
                          >
                            <Avatar className="h-9 w-9 shrink-0">
                              <AvatarFallback className={cn("text-xs font-semibold", colorFromName(msg.author))}>
                                {initials(msg.author)}
                              </AvatarFallback>
                            </Avatar>
                            <div className={cn("max-w-[75%]", msg.isMe && "items-end")}>
                              <div
                                className={cn(
                                  "flex items-center gap-2 mb-1",
                                  msg.isMe && "justify-end"
                                )}
                              >
                                <span className="text-xs font-semibold text-foreground">
                                  {msg.author}
                                </span>
                                {msg.isOrganizer && (
                                  <Badge variant="secondary" className="text-[10px] py-0 h-4">
                                    Organizer
                                  </Badge>
                                )}
                                <span className="text-[10px] text-muted-foreground">
                                  {format(msg.date, "p")}
                                </span>
                              </div>
                              <div
                                className={cn(
                                  "rounded-2xl px-4 py-2.5 text-sm leading-relaxed border",
                                  msg.isMe
                                    ? "bg-primary text-primary-foreground border-primary rounded-tr-sm"
                                    : msg.isOrganizer
                                    ? "bg-secondary/10 border-secondary/20 text-foreground rounded-tl-sm"
                                    : "bg-muted/60 border-border text-foreground rounded-tl-sm"
                                )}
                              >
                                {msg.text}
                              </div>
                              {msg.isMe && (
                                <div className="flex justify-end mt-1">
                                  <CheckCheck className="h-3 w-3 text-secondary" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Composer */}
              <div className="border-t border-border p-3 bg-card">
                <div className="flex items-end gap-2">
                  <Button variant="ghost" size="icon" className="shrink-0" aria-label="Attach">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="shrink-0" aria-label="Image">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    placeholder="Write a message…"
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" className="shrink-0" aria-label="Emoji">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button onClick={send} disabled={!draft.trim()} className="shrink-0">
                    <Send className="h-4 w-4 mr-1" /> Send
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-4">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="font-display font-bold text-foreground mb-3">About this activity</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {opportunity.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-foreground">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-start gap-2 text-foreground">
                    <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>
                      {format(new Date(opportunity.startDate), "MMM d")} —{" "}
                      {format(new Date(opportunity.endDate), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-foreground">
                    <Users className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{memberCount} members in chat</span>
                  </div>
                </div>
                <Link to={`/volunteer/${opportunity.id}`} className="block mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    View full details
                  </Button>
                </Link>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold text-foreground">Members</h3>
                  <Badge variant="secondary">{memberCount}</Badge>
                </div>
                <ul className="space-y-2.5 max-h-72 overflow-auto pr-1">
                  <li className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={cn("text-xs font-semibold", colorFromName(opportunity.contactName))}>
                        {initials(opportunity.contactName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{opportunity.contactName}</p>
                      <p className="text-xs text-muted-foreground">Organizer</p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-secondary" />
                  </li>
                  {opportunity.volunteers.slice(0, 8).map((v) => (
                    <li key={v.name} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={cn("text-xs font-semibold", colorFromName(v.name))}>
                          {initials(v.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{v.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{v.role}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default VolunteerChat;
