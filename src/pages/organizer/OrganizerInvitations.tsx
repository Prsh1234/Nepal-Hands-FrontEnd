import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Send, Clock, CheckCircle2, XCircle } from "lucide-react";
import { type InviteStatus } from "@/types/invitations";
import { getOrganizerInvitations, withdrawInvitation } from "@/services/invitationService";
import { toast } from "@/hooks/use-toast";

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

const OrganizerInvitations = () => {
  const [tab, setTab] = useState<
  "all" | "PENDING" | "ACCEPTED" | "DECLINED"
>("all");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const data = await getOrganizerInvitations();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };
  const handleWithdraw = async (id: number) => {
    try {
      await withdrawInvitation(id);

      setItems(prev => prev.filter(i => i.id !== id));

      toast({
        title: "Invitation withdrawn"
      });
    } catch (e) {
      console.error(e);

      toast({
        title: "Failed",
        description: "Unable to withdraw invitation.",
        variant: "destructive"
      });
    }
  };
  const filtered = useMemo(
    () => (tab === "all" ? items : items.filter((i) => i.status === tab)),
    [items, tab]
  );
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Send className="w-5 h-5 text-primary" />
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Invitations</h1>
          <p className="text-sm text-muted-foreground">Track invitations you've sent to volunteers.</p>
        </div>
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
              No invitations in this list yet.
            </CardContent></Card>
          ) : (
            filtered.map((i) => {
              const cfg = statusCfg[i.status];
              const Icon = cfg.icon;
              return (
                <Card key={i.id}>
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl font-heading mx-auto overflow-hidden">
                        {i.volunteerAvatar ? (
                          <img
                            src={`data:image/jpeg;base64,${i.volunteerAvatar}`}
                            alt={`${i.volunteerName} `}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          `${i.volunteerName?.charAt(0).toUpperCase() ?? ""}`
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-heading font-semibold text-foreground">{i.volunteerName}</h3>
                          <Badge variant="outline" className={cfg.className + " gap-1"}>
                            <Icon className="w-3 h-3" /> {cfg.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Invited to <span className="font-medium text-foreground">{i.opportunityTitle}</span>
                        </p>
                        <p className="text-sm text-foreground mt-2 italic">"{i.message}"</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Sent {new Date(i.sentAt).toLocaleString()}
                          {i.respondedAt && ` · Responded ${new Date(i.respondedAt).toLocaleString()}`}
                        </p>
                        {i.responseNote && (
                          <p className="text-sm text-foreground mt-2 border-l-2 border-primary/40 pl-3">
                            {i.responseNote}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 flex gap-2">
                        {i.status === "PENDING" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleWithdraw(i.id)}
                          >
                            Withdraw
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
    </div>
  );
};

export default OrganizerInvitations;