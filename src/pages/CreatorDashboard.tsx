import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  HandHeart,
  Users,
  Eye,
  Plus,
  ArrowRight,
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  BarChart3,
  Megaphone,
  Edit,
  MoreHorizontal,
} from "lucide-react";

const mockCreator = {
  name: "Sita Devi Thapa",
  avatar: "ST",
  joinedDate: "March 2025",
  verified: true,
};

const mockCampaigns = [
  {
    id: "clean-water-dolakha",
    title: "Clean Water for Dolakha",
    category: "Water & Sanitation",
    status: "active" as const,
    raised: 450000,
    goal: 600000,
    donors: 142,
    daysLeft: 18,
    views: 2340,
    createdDate: "2026-02-15",
  },
  {
    id: "school-rebuilding-sindhupalchok",
    title: "School Rebuilding in Sindhupalchok",
    category: "Education",
    status: "active" as const,
    raised: 820000,
    goal: 1000000,
    donors: 287,
    daysLeft: 5,
    views: 5120,
    createdDate: "2026-01-10",
  },
  {
    id: "womens-skill-training",
    title: "Women's Skill Training Center",
    category: "Women Empowerment",
    status: "draft" as const,
    raised: 0,
    goal: 500000,
    donors: 0,
    daysLeft: 45,
    views: 0,
    createdDate: "2026-04-12",
  },
  {
    id: "heritage-restoration-patan",
    title: "Heritage Restoration in Patan",
    category: "Culture & Heritage",
    status: "completed" as const,
    raised: 350000,
    goal: 350000,
    donors: 98,
    daysLeft: 0,
    views: 3890,
    createdDate: "2025-11-01",
  },
];

const mockVolunteerOps = [
  {
    id: "teach-dolakha-children",
    title: "Teach Children in Dolakha",
    category: "Teaching",
    status: "active" as const,
    applicants: 24,
    accepted: 8,
    capacity: 10,
    location: "Dolakha, Bagmati Province",
    startDate: "2026-05-01",
    createdDate: "2026-03-20",
  },
  {
    id: "medical-camp-jumla",
    title: "Medical Camp in Jumla",
    category: "Healthcare",
    status: "active" as const,
    applicants: 15,
    accepted: 5,
    capacity: 12,
    location: "Jumla, Karnali Province",
    startDate: "2026-06-15",
    createdDate: "2026-04-01",
  },
  {
    id: "trail-restoration-annapurna",
    title: "Trail Restoration – Annapurna",
    category: "Environment",
    status: "closed" as const,
    applicants: 40,
    accepted: 20,
    capacity: 20,
    location: "Annapurna, Gandaki Province",
    startDate: "2026-04-01",
    createdDate: "2026-02-10",
  },
];

const campaignStatusConfig = {
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground border-border" },
  completed: { label: "Completed", className: "bg-primary/10 text-primary border-primary/20" },
};

const volunteerStatusConfig = {
  active: { label: "Open", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  closed: { label: "Closed", className: "bg-muted text-muted-foreground border-border" },
};

const totalRaised = mockCampaigns.reduce((s, c) => s + c.raised, 0);
const totalDonors = mockCampaigns.reduce((s, c) => s + c.donors, 0);
const totalApplicants = mockVolunteerOps.reduce((s, v) => s + v.applicants, 0);
const totalViews = mockCampaigns.reduce((s, c) => s + c.views, 0);

const CreatorDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl font-heading">
                {mockCreator.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold font-heading text-foreground">
                    Creator Dashboard
                  </h1>
                  {mockCreator.verified && (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  )}
                </div>
                <p className="text-muted-foreground">
                  {mockCreator.name} · Member since {mockCreator.joinedDate}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/create">
                  <Plus className="w-4 h-4 mr-1" /> New Campaign
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/volunteer/create">
                  <HandHeart className="w-4 h-4 mr-1" /> New Opportunity
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: TrendingUp, label: "Total Raised", value: `NPR ${totalRaised.toLocaleString()}`, color: "text-primary" },
            { icon: Users, label: "Total Donors", value: totalDonors.toLocaleString(), color: "text-secondary" },
            { icon: HandHeart, label: "Volunteer Applicants", value: totalApplicants.toLocaleString(), color: "text-accent-foreground" },
            { icon: Eye, label: "Total Views", value: totalViews.toLocaleString(), color: "text-muted-foreground" },
          ].map((stat, i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold font-heading text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="campaigns" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="campaigns" className="gap-2">
                <Megaphone className="w-4 h-4" /> My Campaigns ({mockCampaigns.length})
              </TabsTrigger>
              <TabsTrigger value="volunteers" className="gap-2">
                <HandHeart className="w-4 h-4" /> Volunteer Opportunities ({mockVolunteerOps.length})
              </TabsTrigger>
            </TabsList>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns">
              <div className="space-y-4">
                {mockCampaigns.map((campaign, i) => {
                  const progress = campaign.goal > 0 ? Math.round((campaign.raised / campaign.goal) * 100) : 0;
                  const config = campaignStatusConfig[campaign.status];
                  return (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <Link
                                  to={`/campaign/${campaign.id}`}
                                  className="text-lg font-semibold font-heading text-foreground hover:text-primary transition-colors"
                                >
                                  {campaign.title}
                                </Link>
                                <Badge variant="outline" className={config.className}>
                                  {config.label}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {campaign.category}
                                </Badge>
                              </div>

                              {campaign.status !== "draft" && (
                                <div className="mt-3">
                                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                    <span>NPR {campaign.raised.toLocaleString()} / {campaign.goal.toLocaleString()}</span>
                                    <span>{progress}%</span>
                                  </div>
                                  <Progress value={progress} className="h-2" />
                                </div>
                              )}

                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5" />
                                  {campaign.donors} donors
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3.5 h-3.5" />
                                  {campaign.views} views
                                </span>
                                {campaign.status === "active" && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {campaign.daysLeft} days left
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  Created {new Date(campaign.createdDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2 shrink-0">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/campaign/${campaign.id}`}>
                                  <BarChart3 className="w-4 h-4 mr-1" /> View
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Volunteer Opportunities Tab */}
            <TabsContent value="volunteers">
              <div className="space-y-4">
                {mockVolunteerOps.map((opp, i) => {
                  const fillRate = opp.capacity > 0 ? Math.round((opp.accepted / opp.capacity) * 100) : 0;
                  const config = volunteerStatusConfig[opp.status];
                  return (
                    <motion.div
                      key={opp.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <Link
                                  to={`/volunteer/${opp.id}`}
                                  className="text-lg font-semibold font-heading text-foreground hover:text-primary transition-colors"
                                >
                                  {opp.title}
                                </Link>
                                <Badge variant="outline" className={config.className}>
                                  {config.label}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {opp.category}
                                </Badge>
                              </div>

                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                  <span>{opp.accepted} / {opp.capacity} spots filled</span>
                                  <span>{opp.applicants} applicants</span>
                                </div>
                                <Progress value={fillRate} className="h-2" />
                              </div>

                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {opp.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  Starts {new Date(opp.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5" />
                                  {opp.applicants} applied
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2 shrink-0">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/volunteer/${opp.id}`}>
                                  <Eye className="w-4 h-4 mr-1" /> View
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default CreatorDashboard;
