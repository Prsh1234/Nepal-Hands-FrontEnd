import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { getOrganizerCampaigns, updateCampaignStatus } from "@/services/organizerDashboard";
import {
  BarChart3, Edit, Plus, Users, Eye, Clock, Calendar, Search,
  MoreHorizontal, CheckCircle2, PauseCircle, PlayCircle, XCircle,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  pending: { label: "Pending Review", className: "bg-muted text-muted-foreground border-border" },
  closed: { label: "Closed", className: "bg-primary/10 text-primary border-primary/20" },
  completed: { label: "Completed", className: "bg-green-100 text-emerald-700 border-emerald-200" },
  rejected: { label: "Rejected", className: "bg-amber-100 text-amber-700 border-amber-200" },
};

const OrganizerCampaigns = () => {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState("desc");
  const [pending, setPending] = useState<{ id: string; action: "complete" | "close" } | null>(null);

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);
  const filtered = campaigns.filter(
    (c) =>
      (filter === "all" || c.status === filter) &&
      c.title.toLowerCase().includes(q.toLowerCase())
  );
  useEffect(() => {
    setLoading(true);
      getOrganizerCampaigns(
        page,
        10,
        direction,
      )
        .then((res) => {
          setCampaigns(res.content);
          setTotalPages(res.totalPages);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
  }, [page, direction,]);

  const confirmPending = () => {
    if (!pending) return;
    const c = campaigns.find((x) => x.id === pending.id);
    if (!c) return;
    if (pending.action === "complete") {
      updateStatus(pending.id, "COMPLETED");
      toast.success(`"${c.title}" marked as completed.`);
    } else {
      updateStatus(pending.id, "CLOSED");
      toast.success(`"${c.title}" has been closed.`);
    }
    setPending(null);
  };


  const updateStatus = async (
    id: string,
    status: "COMPLETED" | "CLOSED"
) => {

  try {
    await updateCampaignStatus(id, status);

    setCampaigns(prev =>
      prev.map(campaign =>
        campaign.id === id
          ? {
              ...campaign,
              status
            }
          : campaign
      )
    );

    toast.success("Status updated");
  } catch (error) {
    toast.error("Failed");
  }
};
  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading campaigns...
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">My Campaigns</h1>
          <p className="text-sm text-muted-foreground">Manage your fundraising campaigns.</p>
        </div>
        <Button asChild>
          <Link to="/organizer/campaign/create"><Plus className="w-4 h-4 mr-1" /> New Campaign</Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search campaigns..." className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "active", "draft", "completed"].map((s) => (
            <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className="capitalize">
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((c) => {
          const pct = c.goal ? Math.round((c.raised / c.goal) * 100) : 0;
          const cfg = statusConfig[c.status.toLowerCase()] ?? statusConfig.active;
          const isDone = c.status === "completed";
          return (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Link to={`/campaign/${c.id}`} className="text-lg font-semibold font-heading text-foreground hover:text-primary">
                        {c.title}
                      </Link>
                      <Badge variant="outline" className={cfg.className}>{cfg.label}</Badge>
                      <Badge variant="secondary" className="text-xs">{c.category}</Badge>
                    </div>
                    {c.status !== "draft" && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>NPR {c.raised.toLocaleString()} / {c.goal.toLocaleString()}</span>
                          <span>{pct}%</span>
                        </div>
                        <Progress value={pct} className="h-2" />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {c.donors} donors</span>
                      {c.status === "active" && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {c.daysLeft} days left</span>}
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(c.createdDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/campaign/${c.id}`}><BarChart3 className="w-4 h-4 mr-1" /> View</Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem
                          disabled={isDone}
                          onClick={() => setPending({ id: c.id, action: "complete" })}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
                          Mark as completed
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          disabled={isDone}
                          onClick={() => setPending({ id: c.id, action: "close" })}
                        >
                          <XCircle className="w-4 h-4 mr-2" /> Close campaign
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="ghost" size="sm" disabled={isDone}><Edit className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card><CardContent className="p-10 text-center text-muted-foreground">No campaigns match.</CardContent></Card>
        )}
      </div>
      {totalPages > 0 && (
        <div className="flex justify-center items-center gap-3">
          <Button
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
            <AlertDialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pending?.action === "complete" ? "Mark campaign as completed?" : "Close this campaign?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.action === "complete"
                ? "This will stop accepting donations and archive the campaign. Donors will be notified and a final report can be posted."
                : "The campaign will stop accepting new donations immediately. You can resume it later from the paused list."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPending}>
              {pending?.action === "complete" ? "Mark completed" : "Close campaign"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrganizerCampaigns;
