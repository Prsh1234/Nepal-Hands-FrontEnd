import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
    ArrowLeft, Send, Paperclip, Smile, Users,
    MapPin, Calendar, MoreVertical, Image as ImageIcon,
    CheckCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ChatOpportunityDetailsResponse, getChatOpportunityDetails } from "@/services/volunteerService";
import { connectRoomWebSocket, disconnectWebSocket, getMessages, sendGroupMessage } from "@/services/chatService";
import { getUserData } from "@/services/userService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const initials = (name: string) =>
    name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

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

const PAGE_SIZE = 30;

// ─── Component ────────────────────────────────────────────────────────────────

const Chat = () => {
    const { id } = useParams();

    // ── State ──
    const [opportunity, setOpportunity] = useState<ChatOpportunityDetailsResponse>(null);
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [draft, setDraft] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // ── Refs ──
    // This div IS the scrollable container — no Radix ScrollArea involved
    const scrollEl = useRef<HTMLDivElement>(null);
    const pageRef = useRef(0);
    const hasMoreRef = useRef(true);
    const loadingMoreRef = useRef(false);
    const isReady = useMemo(() => {
        return !!id && !!user && !!opportunity;
    }, [id, user, opportunity]);
    // Keep refs in sync with state so scroll handler never reads stale values
    useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

    // ── Scroll helpers ──

    const scrollToBottom = useCallback(() => {
        const el = scrollEl.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, []);

    const isNearBottom = useCallback(() => {
        const el = scrollEl.current;
        if (!el) return false;
        return el.scrollHeight - el.scrollTop - el.clientHeight < 200;
    }, []);

    // ── Message loading ──

    const prependMessages = useCallback((older: any[]) => {
        const el = scrollEl.current;
        if (!el) return;

        const oldHeight = el.scrollHeight;
        const oldScrollTop = el.scrollTop;

        setMessages(prev => [...older, ...prev]);

        // Restore scroll position so the viewport doesn't jump
        requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight - oldHeight + oldScrollTop;
        });
    }, []);

    const loadMessages = useCallback(async (pageNumber: number) => {
        const response = await getMessages(id!, pageNumber, PAGE_SIZE);
        const ordered = [...response.content].reverse();

        if (pageNumber === 0) {
            setMessages(ordered);
            requestAnimationFrame(scrollToBottom);
        } else {
            prependMessages(ordered);
        }

        setHasMore(!response.last);
    }, [id, scrollToBottom, prependMessages]);

    // ── Effects: data fetching ──

    useEffect(() => {
        if (!id) return;
        getChatOpportunityDetails(id).then(setOpportunity).catch(console.error);
    }, [id]);

    useEffect(() => {
        getUserData().then(setUser).catch(console.error);
    }, []);

    // Reset + load page 0 whenever the chat room changes
    useEffect(() => {
        if (!isReady) return;
        pageRef.current = 0;
        hasMoreRef.current = true;
        loadingMoreRef.current = false;
        setHasMore(true);
        setMessages([]);
        loadMessages(0);
    }, [isReady]); // intentionally omit loadMessages — it changes with id anyway

    // ── Effect: infinite scroll (load older messages on scroll to top) ──

    useEffect(() => {
        if (!isReady) return;

        const el = scrollEl.current;
        if (!el) return;

        const handleScroll = async () => {
            if (el.scrollTop > 100) return; // not near top
            if (!hasMoreRef.current) return; // nothing left
            if (loadingMoreRef.current) return; // already fetching

            loadingMoreRef.current = true;
            setLoadingMore(true);
            const nextPage = pageRef.current + 1;

            try {
                await loadMessages(nextPage);
                pageRef.current = nextPage;
            } finally {
                loadingMoreRef.current = false;
                setLoadingMore(false);
            }
        };

        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, [isReady, loadMessages]);

    // ── Effect: WebSocket ──

    useEffect(() => {
        if (!isReady) return;

        connectRoomWebSocket(id, (msg) => {
            setMessages(prev => [...prev, {
                id: msg.id,
                opportunityId: msg.opportunityId,
                senderId: msg.senderId,
                senderName: msg.senderId === opportunity?.organizerId
                    ? opportunity?.organizer
                    : msg.senderName,
                content: msg.content,
                sentAt: new Date(msg.sentAt),
            }]);
        });

        return () => disconnectWebSocket();
    }, [isReady]);

    // ── Effect: auto-scroll on new messages (only if already near bottom) ──

    useEffect(() => {
        if (isNearBottom()) scrollToBottom();
    }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Send ──

    const handleSend = () => {
        if (!draft.trim() || !user) return;
        sendGroupMessage({
            opportunityId: Number(id),
            senderId: user.id,
            senderName: `${user.firstName} ${user.lastName}`,
            content: draft,
            sentAt: new Date().toISOString().replace("Z", ""),
        });
        setDraft("");
    };

    // ── Derived data ──

    const normalizedMessages = useMemo(() => messages.map((m) => ({
        id: m.id ?? `${m.senderId}-${m.sentAt}`,
        author: m.senderName,
        text: m.content,
        date: new Date(m.sentAt),
        isMe: m.senderId === user?.id,
    })), [messages, user]);

    const grouped = useMemo(() => {
        const groups: Record<string, typeof normalizedMessages> = {};
        for (const msg of normalizedMessages) {
            const day = format(msg.date, "yyyy-MM-dd");
            if (!groups[day]) groups[day] = [];
            groups[day].push(msg);
        }
        return Object.entries(groups).map(([day, items]) => ({ day, items }));
    }, [normalizedMessages]);

    // ── Early return ──

    if (!opportunity) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                    Activity Not Found
                </h1>
                <Link to="/volunteers">
                    <Button variant="outline">
                        <ArrowLeft size={16} className="mr-2" /> Back to Volunteers
                    </Button>
                </Link>
            </div>
        );
    }

    const memberCount = opportunity.filledSpots + 1;

    // ── Render ──

    return (
        <div className="h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1 min-h-0 container mx-auto px-4 pt-24 pb-4 flex">
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-6xl w-full mx-auto flex-1 flex flex-col"
                >
                    <Link
                        to={`/volunteer/${opportunity.id}`}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft size={16} /> Back to opportunity
                    </Link>

                    <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

                        {/* ── Chat panel ── */}
                        <div className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden h-full min-h-0 min-w-0">

                            {/* Header */}
                            <div className="flex items-center justify-between gap-3 p-4 border-b border-border bg-card">
                                <div className="min-w-0">
                                    <h1 className="font-display text-lg font-bold text-foreground truncate">
                                        {opportunity.title}
                                    </h1>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Users className="h-3 w-3" /> {memberCount} members
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="shrink-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Messages — this div is the scroll container */}
                            <div
                                ref={scrollEl}
                                className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6"
                            >
                                {loadingMore && (
                                    <div className="text-center text-xs text-muted-foreground py-2">
                                        Loading older messages…
                                    </div>
                                )}

                                {grouped.map((g) => (
                                    <div key={g.day} className="space-y-3">
                                        <div className="text-center text-xs text-muted-foreground">
                                            {format(new Date(g.day), "MMMM d, yyyy")}
                                        </div>

                                        {g.items.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={cn("flex gap-3", msg.isMe && "flex-row-reverse")}
                                            >
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>{initials(msg.author)}</AvatarFallback>
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

                                                        <span className="text-[10px] text-muted-foreground">
                                                            {format(msg.date, "p")}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className={cn(
                                                            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed border",
                                                            msg.isMe
                                                                ? "bg-primary text-primary-foreground border-primary rounded-tr-sm"
                                                                :"bg-muted/60 border-border text-foreground rounded-tl-sm"
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
                                        ))}
                                    </div>
                                ))}
                            </div>

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
                                                handleSend();
                                            }
                                        }}
                                        placeholder="Write a message…"
                                        className="flex-1"
                                    />
                                    <Button variant="ghost" size="icon" className="shrink-0" aria-label="Emoji">
                                        <Smile className="h-4 w-4" />
                                    </Button>
                                    <Button onClick={handleSend} disabled={!draft.trim()} className="shrink-0">
                                        <Send className="h-4 w-4 mr-1" /> Send
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* ── Sidebar ── */}
                        <aside className="space-y-4 min-w-0">
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
                                            <AvatarFallback className={cn("text-xs font-semibold", colorFromName(opportunity.organizer))}>
                                                {initials(opportunity.organizer)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{opportunity.organizer}</p>
                                            <p className="text-xs text-muted-foreground">Organizer</p>
                                        </div>
                                        <span className="h-2 w-2 rounded-full bg-secondary" />
                                    </li>
                                    {opportunity.team.slice(0, 8).map((v) => (
                                        <li key={v.fullName} className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className={cn("text-xs font-semibold", colorFromName(v.fullName))}>
                                                    {initials(v.fullName)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">{v.fullName}</p>
                                                <p className="text-xs text-muted-foreground truncate">Volunteer</p>
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

export default Chat;