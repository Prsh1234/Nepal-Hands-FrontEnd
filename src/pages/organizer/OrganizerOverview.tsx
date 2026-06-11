import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, HandHeart, Eye, ArrowRight, Clock } from "lucide-react";
import { mockCampaigns, mockVolunteerOps, mockDonors, mockApplicants } from "@/data/organizer";

const totalRaised = mockCampaigns.reduce((s, c) => s + c.raised, 0);
const totalDonors = mockCampaigns.reduce((s, c) => s + c.donors, 0);
const totalApplicants = mockVolunteerOps.reduce((s, v) => s + v.applicants, 0);
const totalViews = mockCampaigns.reduce((s, c) => s + c.views, 0);

const OrganizerOverview = () => {
  const stats = [
    { icon: TrendingUp, label: "Total Raised", value: `NPR ${totalRaised.toLocaleString()}` },
    { icon: Users, label: "Donors", value: totalDonors.toLocaleString() },
    { icon: HandHeart, label: "Applicants", value: totalApplicants.toLocaleString() },
    { icon: Eye, label: "Page Views", value: totalViews.toLocaleString() },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground">Snapshot of your campaigns and volunteer programs.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i}>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold font-heading text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Active Campaigns</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/organizer/campaigns">View all <ArrowRight className="w-3 h-3 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockCampaigns.filter((c) => c.status === "active").map((c) => {
              const pct = Math.round((c.raised / c.goal) * 100);
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <Link to={`/campaign/${c.id}`} className="font-medium text-foreground hover:text-primary truncate">{c.title}</Link>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {c.daysLeft}d</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>NPR {c.raised.toLocaleString()} / {c.goal.toLocaleString()}</span>
                    <span>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Donations</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/organizer/donors">View all <ArrowRight className="w-3 h-3 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockDonors.slice(0, 5).map((d) => (
              <div key={d.id} className="flex items-center justify-between text-sm">
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{d.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{d.campaign}</p>
                </div>
                <Badge variant="secondary">NPR {d.amount.toLocaleString()}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Pending Applicants</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/organizer/applicants">Review <ArrowRight className="w-3 h-3 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockApplicants.filter((a) => a.status === "pending").map((a) => (
              <div key={a.id} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.opportunity} · {a.experience}</p>
                </div>
                <Badge variant="outline">{a.skills.join(", ")}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizerOverview;
