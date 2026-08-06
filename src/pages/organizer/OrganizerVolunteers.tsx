import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { getOrganizerVolunteers, updateVolunteerOpportunityStatus } from "@/services/organizerDashboard";
import {
  Eye, Edit, Plus, MapPin, Calendar, Users,
  MoreHorizontal, CheckCircle2, XCircle, PlayCircle,
} from "lucide-react";
import { type OrgVolunteerOp } from "@/data/organizer";
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
  completed: { label: "Completed", className: "bg-green-100 text-green-700 border-green-200" },
  closed: { label: "Closed", className: "bg-warning/10 text-primary border-primary/20" },
  rejected: { label: "Rejected", className: "bg-primary/10 text-primary border-primary/20" },
};

const OrganizerVolunteers = () => {
  const [ops, setOps] = useState([]);
  const [pending, setPending] = useState<{ id: string; action: "complete" | "close" } | null>(null);

  const updateStatus = (id: string, status: OrgVolunteerOp["status"]) => {
    setOps((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const confirmPending = async () => {
    if (!pending) return;
  
    const o = ops.find((x) => x.id === pending.id);
  
    if (!o) return;
  
    try {
      const status =
        pending.action === "complete"
          ? "COMPLETED"
          : "CLOSED";
  
      await updateVolunteerOpportunityStatus(
        pending.id,
        status
      );
  
      updateStatus(
        pending.id,
        status.toLowerCase() as OrgVolunteerOp["status"]
      );
  
      toast.success(
        pending.action === "complete"
          ? `"${o.title}" marked as completed.`
          : `"${o.title}" has been closed.`
      );
  
    } catch (error) {
      toast.error("Failed to update opportunity status");
    }
  
    setPending(null);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getOrganizerVolunteers();
        setOps(data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Volunteer Opportunities</h1>
          <p className="text-sm text-muted-foreground">Manage opportunities you have posted.</p>
        </div>
        <Button asChild>
          <Link to="/organizer/volunteer/create"><Plus className="w-4 h-4 mr-1" /> New Opportunity</Link>
        </Button>
      </div>

      <div className="space-y-3">
        {ops.map((o) => {
          const fill = o.capacity ? Math.round((o.filledSpots / o.capacity) * 100) : 0;
          const cfg = statusConfig[o.status.toLowerCase()] ?? statusConfig.closed;
          const isFinal = o.status === "completed" || o.status === "closed";
          return (
            <Card key={o.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Link to={`/volunteer/${o.id}`} className="text-lg font-semibold font-heading text-foreground hover:text-primary">
                        {o.title}
                      </Link>
                      <Badge variant="outline" className={cfg.className}>{cfg.label}</Badge>
                      <Badge variant="secondary" className="text-xs">{o.category}</Badge>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{o.filledSpots} / {o.capacity} spots filled</span>
                      </div>
                      <Progress value={fill} className="h-2" />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {o.location}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Starts {new Date(o.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/volunteer/${o.id}`}><Eye className="w-4 h-4 mr-1" /> View</Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem
                          disabled={o.status === "completed"}
                          onClick={() => setPending({ id: o.id, action: "complete" })}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
                          Mark as completed
                        </DropdownMenuItem>
                        {o.status === "closed" && (
                          <DropdownMenuItem onClick={() => { updateStatus(o.id, "active"); toast.success("Opportunity reopened."); }}>
                            <PlayCircle className="w-4 h-4 mr-2" /> Reopen opportunity
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          disabled={isFinal}
                          onClick={() => setPending({ id: o.id, action: "close" })}
                        >
                          <XCircle className="w-4 h-4 mr-2" /> Close opportunity
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <AlertDialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pending?.action === "complete" ? "Mark opportunity as completed?" : "Close this opportunity?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.action === "complete"
                ? "This archives the opportunity, notifies accepted volunteers, and lets you post a wrap-up update."
                : "New applications will be blocked immediately. Accepted volunteers keep their spot."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPending}>
              {pending?.action === "complete" ? "Mark completed" : "Close opportunity"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrganizerVolunteers;
