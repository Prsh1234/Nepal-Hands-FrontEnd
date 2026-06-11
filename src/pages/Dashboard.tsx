import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  HandHeart,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  Calendar,
  MapPin,
  User,
} from "lucide-react";

const mockUser = {
  name: "Aarav Sharma",
  email: "aarav@example.com",
  avatar: "AS",
  joinedDate: "January 2026",
};

const mockDonations = [
  {
    id: "1",
    campaignId: "clean-water-dolakha",
    campaignTitle: "Clean Water for Dolakha",
    org: "Nepal Water Foundation",
    amount: 5000,
    date: "2026-04-10",
    status: "completed" as const,
    progress: 75,
    raised: 450000,
    goal: 600000,
  },
  {
    id: "2",
    campaignId: "school-rebuilding-sindhupalchok",
    campaignTitle: "School Rebuilding in Sindhupalchok",
    org: "Education First Nepal",
    amount: 10000,
    date: "2026-03-28",
    status: "completed" as const,
    progress: 82,
    raised: 820000,
    goal: 1000000,
  },
  {
    id: "3",
    campaignId: "womens-skill-training",
    campaignTitle: "Women's Skill Training Center",
    org: "Shakti Samuha",
    amount: 3000,
    date: "2026-04-02",
    status: "completed" as const,
    progress: 42,
    raised: 210000,
    goal: 500000,
  },
];

const mockApplications = [
  {
    id: "1",
    opportunityId: "teach-dolakha-children",
    title: "Teach Children in Dolakha",
    org: "Nepal Education Trust",
    appliedDate: "2026-04-08",
    status: "accepted" as const,
    startDate: "2026-05-01",
    location: "Dolakha, Bagmati Province",
    commitment: "Full-time",
  },
  {
    id: "2",
    opportunityId: "medical-camp-jumla",
    title: "Medical Camp in Jumla",
    org: "Health Nepal",
    appliedDate: "2026-04-12",
    status: "pending" as const,
    startDate: "2026-06-15",
    location: "Jumla, Karnali Province",
    commitment: "2 Weeks",
  },
  {
    id: "3",
    opportunityId: "trail-restoration",
    title: "Trail Restoration – Annapurna",
    org: "Nepal Trail Foundation",
    appliedDate: "2026-03-20",
    status: "rejected" as const,
    startDate: "2026-04-01",
    location: "Annapurna, Gandaki Province",
    commitment: "Weekends",
  },
];

const statusConfig = {
  accepted: { label: "Accepted", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  pending: { label: "Pending", icon: Clock, className: "bg-amber-100 text-amber-700 border-amber-200" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-red-100 text-red-700 border-red-200" },
};

const totalDonated = mockDonations.reduce((sum, d) => sum + d.amount, 0);

const Dashboard = () => {
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl font-heading">
                {mockUser.avatar}
              </div>
              <div>
                <h1 className="text-3xl font-bold font-heading text-foreground">
                  Welcome back, {mockUser.name.split(" ")[0]}
                </h1>
                <p className="text-muted-foreground">
                  Member since {mockUser.joinedDate}
                </p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link to="/profile"><User className="w-4 h-4" /> View Profile</Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <Card className="border-primary/20">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Donated</p>
                <p className="text-2xl font-bold font-heading text-foreground">
                  NPR {totalDonated.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-secondary/20">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Campaigns Supported</p>
                <p className="text-2xl font-bold font-heading text-foreground">
                  {mockDonations.length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-accent-foreground/20">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <HandHeart className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Volunteer Applications</p>
                <p className="text-2xl font-bold font-heading text-foreground">
                  {mockApplications.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="donations" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="donations" className="gap-2">
                <Heart className="w-4 h-4" /> My Donations
              </TabsTrigger>
              <TabsTrigger value="applications" className="gap-2">
                <HandHeart className="w-4 h-4" /> Volunteer Applications
              </TabsTrigger>
            </TabsList>

            {/* Donations Tab */}
            <TabsContent value="donations">
              <div className="space-y-4">
                {mockDonations.map((donation, i) => (
                  <motion.div
                    key={donation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/campaign/${donation.campaignId}`}
                              className="text-lg font-semibold font-heading text-foreground hover:text-primary transition-colors"
                            >
                              {donation.campaignTitle}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {donation.org}
                            </p>
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>
                                  NPR {donation.raised.toLocaleString()} raised
                                </span>
                                <span>{donation.progress}%</span>
                              </div>
                              <Progress value={donation.progress} className="h-2" />
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <Badge variant="secondary" className="text-base px-3 py-1">
                              NPR {donation.amount.toLocaleString()}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(donation.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/campaign/${donation.campaignId}`}>
                                View Campaign <ArrowRight className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications">
              <div className="space-y-4">
                {mockApplications.map((app, i) => {
                  const config = statusConfig[app.status];
                  const StatusIcon = config.icon;
                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Link
                                  to={`/volunteer/${app.opportunityId}`}
                                  className="text-lg font-semibold font-heading text-foreground hover:text-primary transition-colors"
                                >
                                  {app.title}
                                </Link>
                                <Badge
                                  variant="outline"
                                  className={`${config.className} gap-1`}
                                >
                                  <StatusIcon className="w-3 h-3" />
                                  {config.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                {app.org}
                              </p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {app.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {app.commitment}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  Starts{" "}
                                  {new Date(app.startDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <span className="text-xs text-muted-foreground">
                                Applied{" "}
                                {new Date(app.appliedDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/volunteer/${app.opportunityId}`}>
                                  View Details <ArrowRight className="w-4 h-4" />
                                </Link>
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

export default Dashboard;
