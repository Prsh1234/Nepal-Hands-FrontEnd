import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Clock, CheckCircle2, XCircle, Mailbox, ExternalLink } from "lucide-react";
import { type Invitation } from "@/types/invitations";
import { toast } from "@/hooks/use-toast";
import { getVolunteerInvitations, respondInvitation } from "@/services/invitationService";

const statusCfg = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
  },
  ACCEPTED: {
    label: "Accepted",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  DECLINED: {
    label: "Declined",
    className: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
  },
};

const Invitations = () => {
  const [tab, setTab] = useState<"PENDING" | "ACCEPTED" | "DECLINED" | "all">("PENDING");
  const [action, setAction] = useState<{ inv: Invitation; type: "accept" | "decline" } | null>(null);
  const [note, setNote] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvitations();
}, []);

const loadInvitations = async () => {

    try{

        setLoading(true);

        const data = await getVolunteerInvitations();

        setItems(data);

    }finally{

        setLoading(false);

    }

};
  const filtered = useMemo(() => {
    if (tab === "all") return items;
    return items.filter((i) => i.status === tab);
  }, [items, tab]);

  const counts = useMemo(() => {
    const c = {
      all: items.length,
      pending: 0,
      accepted: 0,
      declined: 0,
    };
  
    items.forEach((i) => {
      switch (i.status) {
        case "PENDING":
          c.pending++;
          break;
        case "ACCEPTED":
          c.accepted++;
          break;
        case "DECLINED":
          c.declined++;
          break;
      }
    });
  
    return c;
  }, [items]);

  const confirm = async() => {
    if (!action) return;
    await respondInvitation(
      action.inv.id,
      action.type === "accept"
          ? "ACCEPTED"
          : "DECLINED",
      note
  );
  
  setItems(prev =>
    prev.map(i =>
      i.id === action.inv.id
        ? {
            ...i,
            status: action.type === "accept" 
              ? "ACCEPTED" 
              : "DECLINED",
            responseNote: note
          }
        : i
    )
  );
    toast({
      title: action.type === "accept" ? "Invitation accepted" : "Invitation declined",
      description: `You responded to ${action.inv.organizerName}'s invitation.`,
    });
    setAction(null);
    setNote("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 pt-24 pb-32">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading text-foreground flex items-center gap-2">
            <Mailbox className="w-7 h-7 text-primary" /> My Invitations
          </h1>
          <p className="text-muted-foreground mt-1">
            Organizers who think you're a strong fit will reach out here.
          </p>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList>
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="PENDING">Pending ({counts.pending})</TabsTrigger>
          <TabsTrigger value="ACCEPTED">Accepted ({counts.accepted})</TabsTrigger>
          <TabsTrigger value="DECLINED">Declined ({counts.declined})</TabsTrigger>
          </TabsList>
          <TabsContent value={tab} className="mt-4 space-y-3">
            {filtered.length === 0 ? (
              <Card><CardContent className="p-10 text-center text-muted-foreground">
                No invitations here yet.
              </CardContent></Card>
            ) : (
              filtered.map((i) => {
                const cfg = statusCfg[i.status];
                const Icon = cfg.icon;
                return (
                  <Card key={i.id}>
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-heading font-semibold text-foreground">
                              {i.opportunityTitle}
                            </h3>
                            <Badge variant="outline" className={cfg.className + " gap-1"}>
                              <Icon className="w-3 h-3" /> {cfg.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            From <span className="font-medium text-foreground">{i.organizerName}</span>
                          </p>
                          <p className="text-sm text-foreground mt-3 border-l-2 border-primary/40 pl-3">
                            {i.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-3">
                            Received {new Date(i.sentAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="shrink-0 flex flex-col gap-2 min-w-[10rem]">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/volunteer/${i.opportunityId}`}>
                              <ExternalLink className="w-4 h-4 mr-1" /> View details
                            </Link>
                          </Button>
                          {i.status === "PENDING" && (
                            <>
                              <Button size="sm" onClick={() => setAction({ inv: i, type: "accept" })}>
                                <CheckCircle2 className="w-4 h-4 mr-1" /> Accept
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => setAction({ inv: i, type: "decline" })}>
                                <XCircle className="w-4 h-4 mr-1" /> Decline
                              </Button>
                            </>
                          )}
                          {i.status === "ACCEPTED" && (
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/volunteer/chat/${i.opportunityId}`}>Open chat</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      <Dialog open={!!action} onOpenChange={(o) => !o && (setAction(null), setNote(""))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action?.type === "accept" ? "Accept invitation" : "Decline invitation"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {action?.type === "accept"
              ? `You're accepting the invitation to "${action?.inv.opportunityTitle}". The organizer will be notified.`
              : `You're declining the invitation to "${action?.inv.opportunityTitle}". A short reason helps organizers.`}
          </p>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={action?.type === "accept" ? "Optional message to the organizer" : "Reason (optional)"}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAction(null); setNote(""); }}>Cancel</Button>
            <Button onClick={confirm} variant={action?.type === "decline" ? "destructive" : "default"}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invitations;