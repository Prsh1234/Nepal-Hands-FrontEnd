import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { BarChart3, Edit, Plus, Users, Eye, Clock, Calendar, Search } from "lucide-react";
import { getOrganizerCampaigns } from "@/services/organizerDashboard";

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  pending: { label: "Pending Review", className: "bg-muted text-muted-foreground border-border" },
  completed: { label: "Completed", className: "bg-primary/10 text-primary border-primary/20" },
  rejected: { label: "Rejected", className: "bg-amber-100 text-amber-700 border-amber-200" },
};

const OrganizerCampaigns = () => {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const filtered = campaigns.filter(
    (c) =>
      (filter === "all" || c.status === filter) &&
      c.title.toLowerCase().includes(q.toLowerCase())
  );
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getOrganizerCampaigns();
        setCampaigns(data);
      } catch (err) {
        console.error("Failed to load campaigns", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);
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
          <Link to="/create"><Plus className="w-4 h-4 mr-1" /> New Campaign</Link>
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
          const cfg = statusConfig[c.status];
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
                    <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
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
    </div>
  );
};

export default OrganizerCampaigns;
