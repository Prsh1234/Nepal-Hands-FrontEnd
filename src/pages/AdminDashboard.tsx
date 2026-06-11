import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import {
  Users, Heart, HandHelping, TrendingUp, Shield, AlertTriangle,
  CheckCircle, XCircle, Clock, Eye, Search, Ban, Flag, Loader2,
  DollarSign,
  Activity,
  BarChart3,
  BadgeCheck,
  DeleteIcon,
} from "lucide-react";


// Mock data
const platformStats = {
  totalUsers: 1247,
  activeCampaigns: 18,
  totalDonations: 4850000,
  volunteerApplications: 342,
  pendingApprovals: 7,
  flaggedItems: 3,
  monthlyGrowth: 12.5,
  conversionRate: 8.3,
};




const flaggedItems = [
  { id: "f1", type: "Campaign", title: "Suspicious Fundraiser XYZ", reason: "Unverified organization", reportedBy: 5, date: "2026-04-13" },
  { id: "f2", type: "User", title: "user_spam_123", reason: "Spam activity detected", reportedBy: 8, date: "2026-04-12" },
  { id: "f3", type: "Campaign", title: "Duplicate Campaign Report", reason: "Duplicate of existing campaign", reportedBy: 3, date: "2026-04-11" },
];

const recentUsers = [
  { id: "u1", name: "Anita Shrestha", email: "anita@example.com", joined: "2026-04-15", role: "Creator", campaigns: 2, status: "active" as const },
  { id: "u2", name: "Bikash Tamang", email: "bikash@example.com", joined: "2026-04-14", role: "Donor", campaigns: 0, status: "active" as const },
  { id: "u3", name: "Chandra Rai", email: "chandra@example.com", joined: "2026-04-13", role: "Volunteer", campaigns: 0, status: "active" as const },
  { id: "u4", name: "Deepa Gurung", email: "deepa@example.com", joined: "2026-04-12", role: "Creator", campaigns: 1, status: "suspended" as const },
  { id: "u5", name: "Eshan Maharjan", email: "eshan@example.com", joined: "2026-04-11", role: "Donor", campaigns: 0, status: "active" as const },
];

const recentTransactions = [
  { id: "t1", donor: "Ram K.", campaign: "Clean Water for Dolakha", amount: 15000, date: "2026-04-15 14:32", status: "completed" as const },
  { id: "t2", donor: "Anonymous", campaign: "School Rebuilding", amount: 25000, date: "2026-04-15 12:10", status: "completed" as const },
  { id: "t3", donor: "Sita P.", campaign: "Women's Skill Training", amount: 5000, date: "2026-04-15 09:45", status: "completed" as const },
  { id: "t4", donor: "Hari B.", campaign: "Clean Water for Dolakha", amount: 50000, date: "2026-04-14 18:20", status: "completed" as const },
  { id: "t5", donor: "Maya L.", campaign: "School Rebuilding", amount: 10000, date: "2026-04-14 15:00", status: "refunded" as const },
];

const StatCard = ({ icon: Icon, label, value, trend, color }: { icon: any; label: string; value: string; trend?: string; color: string }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold font-heading mt-1">{value}</p>
            {trend && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" />{trend}</p>}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const statusBadge = (status: string) => {
  const config: Record<string, { variant: any; label: string }> = {
    PENDING_REVIEW: { variant: "outline", label: "Pending" },
    ACTIVE: { variant: "default", label: "Active" },
    REJECTED: { variant: "destructive", label: "Rejected" },
    CLOSED: { variant: "secondary", label: "Closed" },
  };
  const c = config[status] || { variant: "outline", label: status };
  return <Badge variant={c.variant}>{c.label}</Badge>;
};

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading text-foreground flex items-center gap-2">
              <Shield className="h-7 w-7 text-primary" /> Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Platform management & moderation</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users, campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Total Users" value={platformStats.totalUsers.toLocaleString()} trend="+12.5% this month" color="bg-accent text-accent-foreground" />
          <StatCard icon={Heart} label="Active Campaigns" value={platformStats.activeCampaigns.toString()} color="bg-primary/10 text-primary" />
          <StatCard icon={DollarSign} label="Total Donations" value={`NPR ${(platformStats.totalDonations / 1000000).toFixed(1)}M`} trend="+8.3% this month" color="bg-secondary/10 text-secondary" />
          <StatCard icon={HandHelping} label="Volunteer Apps" value={platformStats.volunteerApplications.toString()} color="bg-accent text-accent-foreground" />
        </div>

        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-yellow-200 bg-yellow-50/50">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-sm">{platformStats.pendingApprovals} Pending Approvals</p>
                <p className="text-xs text-muted-foreground">Campaigns & volunteer requests awaiting review</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-4 flex items-center gap-3">
              <Flag className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-sm">{platformStats.flaggedItems} Flagged Items</p>
                <p className="text-xs text-muted-foreground">Require moderation attention</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-4 flex items-center gap-3">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-sm">{platformStats.conversionRate}% Conversion</p>
                <p className="text-xs text-muted-foreground">Visitor to donor conversion rate</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="approvals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="approvals" className="gap-1"><Clock className="h-4 w-4" /> Approvals</TabsTrigger>
            <TabsTrigger value="kyc" className="gap-1"><BadgeCheck className="h-4 w-4" /> KYC</TabsTrigger>
            <TabsTrigger value="flagged" className="gap-1"><Flag className="h-4 w-4" /> Flagged</TabsTrigger>
            <TabsTrigger value="users" className="gap-1"><Users className="h-4 w-4" /> Users</TabsTrigger>
            <TabsTrigger value="transactions" className="gap-1"><BarChart3 className="h-4 w-4" /> Transactions</TabsTrigger>
          </TabsList>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-6">
            
          </TabsContent>


          {/* Kyc Tab */}
          <TabsContent value="kyc">
            
          </TabsContent>



          {/* Flagged Tab */}
          <TabsContent value="flagged">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Flagged & Reported Items</CardTitle>
                <CardDescription>Items reported by users that need moderation</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Reports</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flaggedItems.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell>
                          <Badge variant={f.type === "User" ? "secondary" : "outline"}>{f.type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{f.title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{f.reason}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-destructive font-medium">
                            <AlertTriangle className="h-3 w-3" /> {f.reportedBy}
                          </span>
                        </TableCell>
                        <TableCell>{f.date}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                          <Button size="sm" variant="destructive"><Ban className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline"><CheckCircle className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Management</CardTitle>
                <CardDescription>View and manage platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Campaigns</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{u.email}</TableCell>
                        <TableCell><Badge variant="outline">{u.role}</Badge></TableCell>
                        <TableCell>{u.campaigns}</TableCell>
                        <TableCell>{u.joined}</TableCell>
                        <TableCell>{statusBadge(u.status)}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline"><Ban className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                <CardDescription>Monitor donation transactions across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Amount (NPR)</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.donor}</TableCell>
                        <TableCell>{t.campaign}</TableCell>
                        <TableCell className="font-semibold">{t.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{t.date}</TableCell>
                        <TableCell>{statusBadge(t.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      {/* Volunteer Request Details Dialog */}
      

      

    </div>
  );
};

export default AdminDashboard;
