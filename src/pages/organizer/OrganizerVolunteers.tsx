import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, Edit, Plus, MapPin, Calendar, Users } from "lucide-react";
import { mockVolunteerOps } from "@/data/organizer";
import { useEffect, useState } from "react";
import { getOrganizerVolunteers } from "@/services/organizerDashboard";

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  pending: { label: "Pending Review", className: "bg-muted text-muted-foreground border-border" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700 border-green-200" },
  rejected: { label: "Rejected", className: "bg-primary/10 text-primary border-primary/20" },
};

const OrganizerVolunteers = () => {
  const [ops, setOps] = useState([]);

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
          <Link to="/volunteer/create"><Plus className="w-4 h-4 mr-1" /> New Opportunity</Link>
        </Button>
      </div>

      <div className="space-y-3">
        {ops.map((o) => {
          const fill = o.capacity ? Math.round((o.accepted / o.capacity) * 100) : 0;
          const cfg = statusConfig[o.status];
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
                        <span>{o.accepted} / {o.capacity} spots filled</span>
                        <span>{o.applicants} applicants</span>
                      </div>
                      <Progress value={fill} className="h-2" />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {o.location}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Starts {new Date(o.startDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {o.applicants} applied</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/volunteer/${o.id}`}><Eye className="w-4 h-4 mr-1" /> View</Link>
                    </Button>
                    <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OrganizerVolunteers;
