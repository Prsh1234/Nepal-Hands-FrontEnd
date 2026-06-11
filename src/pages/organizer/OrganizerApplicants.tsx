import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, MessageCircle } from "lucide-react";
import { mockApplicants } from "@/data/organizer";
import { toast } from "sonner";
import { approveVolunteerApplication, getOrganizerVolunteerSelect, getVolunteerApplications, rejectVolunteerApplication } from "@/services/organizerDashboard";
import { Label } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Link } from "react-router-dom";
import ConfirmationModal from "@/modal/ConfirmationModal";

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const OrganizerApplicants = () => {
  const [volunteerId, setVolunteerId] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [volunteerOps, setVolunteerOps] = useState([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);


  useEffect(() => {
    getOrganizerVolunteerSelect()
      .then(setVolunteerOps)
      .catch(console.error);

  }, []);
  useEffect(() => {
    setLoading(true);

    getVolunteerApplications(
      page,
      10,
      volunteerId === "all" ? undefined : volunteerId,
      filter === "all" ? undefined : filter
    )
      .then((data) => {
        setApplications(data.content);
        setTotalPages(data.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, volunteerId, filter]);
  const filteredApplications = applications.filter(
    (a) => filter === "all" || a.status === filter
  );
  const handleOpportunityChange = (value: string) => {
    setVolunteerId(value);
    setPage(0);
  };

  const handleStatusChange = (value: string) => {
    setFilter(value);
    setPage(0);
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Volunteer Applicants</h1>
        <p className="text-sm text-muted-foreground">Review and respond to applications.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
        <div className="flex flex-col md:flex-row gap-4 w-full">

          {/* Opportunity Filter */}
          <div className="w-full md:w-72">
            <Label className="mb-2 block">Opportunity</Label>
            <Select value={volunteerId} onValueChange={handleOpportunityChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Opportunities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Opportunities</SelectItem>
                {volunteerOps.map((c) => (
                  <SelectItem
                    key={c.id}
                    value={String(c.id)}
                  >
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48">
            <Label className="mb-2 block">Status</Label>
            <Select value={filter} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
      </div>

      <div className="space-y-3">
        {!loading && filteredApplications.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No applications found.
            </CardContent>
          </Card>
        )}
        {filteredApplications.map((a) => {
          const cfg = statusConfig[a.status];
          return (
            <Card key={a.id}>
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-heading font-bold">
                    {a.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{a.fullName}</p>

                    <div className="text-xs text-muted-foreground">
                      <Link
                        to={`/volunteer/${a.opportunityId}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {a.opportunityTitle}
                      </Link>
                      <span> · applied {formatDate(a.appliedAt)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Motivation: {a.motivation}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className={cfg.className}>{cfg.label}</Badge>
                  {a.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          setSelectedApplication(a);
                          setApproveOpen(true);
                        }}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        variant="outline"
                        onClick={() => {
                          setSelectedApplication(a);
                          setRejectOpen(true);
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

          );
        })}
        {totalPages > 0 && (
          <div className="flex items-center justify-center gap-2 pt-4">
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
      </div>
      <ConfirmationModal
        open={approveOpen}
        onOpenChange={setApproveOpen}
        title="Approve Application"
        description={`Approve ${selectedApplication?.fullName}'s application?`}
        confirmText="Approve"
        loading={actionLoading}
        onConfirm={async () => {
          try {
            setActionLoading(true);

            const response =
              await approveVolunteerApplication(
                selectedApplication.id
              );

            toast.success(response.message);

            setApplications((prev) =>
              prev.map((app) =>
                app.id === selectedApplication.id
                  ? { ...app, status: "APPROVED" }
                  : app
              )
            );

            setApproveOpen(false);
          } catch (error: any) {
            toast.error(
              error?.response?.data?.message ??
              "Failed to approve application"
            );
          } finally {
            setActionLoading(false);
          }
        }}
      />

      <ConfirmationModal
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Reject Application"
        description={`Reject ${selectedApplication?.fullName}'s application?`}
        confirmText="Reject"
        variant="destructive"
        loading={actionLoading}
        onConfirm={async () => {
          try {
            setActionLoading(true);

            const response =
              await rejectVolunteerApplication(
                selectedApplication.id
              );

            toast.success(response.message);

            setApplications((prev) =>
              prev.map((app) =>
                app.id === selectedApplication.id
                  ? { ...app, status: "REJECTED" }
                  : app
              )
            );

            setRejectOpen(false);
          } catch (error: any) {
            toast.error(
              error?.response?.data?.message ??
              "Failed to reject application"
            );
          } finally {
            setActionLoading(false);
          }
        }}
      />
    </div>

  );
};

export default OrganizerApplicants;
