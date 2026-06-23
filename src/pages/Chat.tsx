import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
    ArrowLeft, Send, Paperclip, Smile, Users,
    MapPin, Calendar, MoreVertical, Image as ImageIcon,
    CheckCheck,
    FileType,
    FileText,
    X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ChatOpportunityDetailsResponse, getChatOpportunityDetails } from "@/services/volunteerService";
import { connectRoomWebSocket, disconnectWebSocket, getMessages, sendFileMessage, sendGroupMessage } from "@/services/chatService";
import { getUserData } from "@/services/userService";
import ImageModal from "@/modal/ImageModal";

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
// ─── File attachment renderer (reused in bubble + preview) ───────────────────

const FileAttachment = ({
    src,
    fileType,
    fileName,
    isDataUri = false,
    onImageClick,
}: {
    src: string;
    fileType: string;
    fileName?: string;
    isDataUri?: boolean;
    onImageClick?: (href: string) => void;
}) => {
    const href = isDataUri ? src : `data:${fileType};base64,${src}`;

    if (fileType.startsWith("image/")) {
        return (
            <img
                src={href}
                alt="attachment"
                onClick={() => onImageClick?.(href)}
                className="mt-2 max-w-[240px] max-h-[200px] rounded-lg object-contain border border-border cursor-zoom-in"
            />
        );
    }

    return (

        <a href={href}
            download={fileName ?? "attachment"}
            className="mt-2 inline-flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2 text-xs hover:bg-background transition-colors"
        >
            <FileText className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate max-w-[180px]">{fileName ?? "Download attachment"}</span>
        </a>
    );
};

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
    const [file, setFile] = useState<File | null>(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);  // object URL for preview
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
    // ── File selection ──

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        // Revoke previous object URL to avoid memory leaks
        if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);

        setFile(selected);
        setFilePreviewUrl(URL.createObjectURL(selected));
        e.target.value = "";
    };

    const clearFile = () => {
        if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
        setFile(null);
        setFilePreviewUrl(null);
    };


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
                content: msg?.content,
                sentAt: new Date(msg.sentAt),
                file: msg.file,
                fileType: msg.fileType,
                fileName: msg.fileName,
            }]);
        });

        return () => disconnectWebSocket();
    }, [isReady]);

    // ── Effect: auto-scroll on new messages (only if already near bottom) ──

    useEffect(() => {
        if (isNearBottom()) scrollToBottom();
    }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Send ──

    const handleSend = async () => {
        if ((!draft.trim() && !file) || !user) return;

        // ── File: REST upload → backend saves to DB + broadcasts via WebSocket ──
        if (file) {
            try {
                await sendFileMessage(
                    file,
                    Number(id),
                    user.id,
                    `${user.firstName} ${user.lastName}`
                );
            } catch (err) {
                console.error("File upload failed:", err);
            }
            clearFile();

        }

        // ── Text: straight through WebSocket ──
        if (draft.trim()) {
            sendGroupMessage({
                opportunityId: Number(id),
                senderId: user.id,
                senderName: `${user.firstName} ${user.lastName}`,
                content: draft,
            });
            setDraft("");
        }
    };

    // ── Derived data ──

    const normalizedMessages = useMemo(() => messages.map((m) => ({
        id: m.id ?? `${m.senderId}-${m.sentAt}`,
        author: m.senderName,
        text: m.content,
        file: m.file ?? null,
        fileType: m.fileType ?? null,
        fileName: m.fileName ?? null,   // ← add
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
                                                    {/* text bubble — only rendered when there's text */}
                                                    {msg.text && (
                                                        <div className={cn(
                                                            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed border",
                                                            msg.isMe
                                                                ? "bg-primary text-primary-foreground border-primary rounded-tr-sm"
                                                                : "bg-muted/60 border-border text-foreground rounded-tl-sm"
                                                        )}>
                                                            {msg.text}
                                                        </div>
                                                    )}

                                                    {/* attachment — rendered outside the bubble, no colored background */}
                                                    {msg.file && msg.fileType && (
                                                        <FileAttachment
                                                            src={msg.file}
                                                            fileType={msg.fileType}
                                                            fileName={msg.fileName}
                                                            isDataUri={false}
                                                            onImageClick={setSelectedImage}
                                                        />
                                                    )}

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            {/* ── File preview strip (shown after selection, before send) ── */}
                            {file && filePreviewUrl && (
                                <div className="border-t border-border px-3 pt-3 bg-card">
                                    <div className="relative inline-block">
                                        {file.type.startsWith("image/") ? (
                                            <img
                                                src={filePreviewUrl}
                                                alt="preview"
                                                className="h-24 w-24 rounded-lg object-cover border border-border"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-xs">
                                                <FileText className="h-4 w-4 text-primary shrink-0" />
                                                <span className="truncate max-w-[160px]">{file.name}</span>
                                            </div>
                                        )}
                                        {/* Remove button */}
                                        <button
                                            onClick={clearFile}
                                            className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Composer */}
                            <div className="border-t border-border p-3 bg-card">
                                <div className="flex items-end gap-2">
                                    <label>
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="icon"
                                            className="shrink-0"
                                        >
                                            <span>
                                                <Paperclip className="h-4 w-4" />
                                            </span>
                                        </Button>

                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            hidden
                                            onChange={handleFileUpload}
                                        />
                                    </label>
                                    <label>
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="icon"
                                            className="shrink-0"
                                        >
                                            <span>
                                                <ImageIcon className="h-4 w-4" />
                                            </span>
                                        </Button>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleFileUpload}
                                        />
                                    </label>
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
                                    <Button onClick={handleSend} disabled={!draft.trim() && !file} className="shrink-0">
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
            <ImageModal
                open={!!selectedImage}
                image={selectedImage}
                onClose={() => setSelectedImage(null)}
            />
        </div >
    );
};

export default Chat;