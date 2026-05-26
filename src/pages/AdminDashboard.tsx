import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Users, Heart, HandHelping, TrendingUp, Shield, AlertTriangle,
  CheckCircle, XCircle, Clock, Eye, Search, Ban, Flag,
  DollarSign, BarChart3, Activity, FileText, MapPin, Calendar,
  Briefcase, Star, ListChecks, Sparkles, Phone, Mail, User,
  Building2, BadgeCheck, FileCheck, Globe, Loader2
} from "lucide-react";
import {
  getVolunteerOpportunities,
  updateVolunteerStatus,
} from "@/services/adminService";
import api from "@/lib/api";
import ImageModal from "@/modal/ImageModal";
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

const pendingCampaigns = [
  { id: "c1", title: "Medical Aid for Humla", org: "Health Nepal", submittedDate: "2026-04-14", category: "Health", goalAmount: 750000, status: "pending" as const },
  { id: "c2", title: "Library for Jumla Schools", org: "Read Nepal", submittedDate: "2026-04-13", category: "Education", goalAmount: 300000, status: "pending" as const },
  { id: "c3", title: "Solar Panels for Mustang", org: "Green Energy Nepal", submittedDate: "2026-04-12", category: "Environment", goalAmount: 500000, status: "pending" as const },
];

type VolunteerRequest = {
  id: number;
  title: string;
  category: string;
  location: string;
  description: string;
  longDescription?: string;

  requiredSkills: string[];
  requirements: string[];

  activities: string[];
  benefits: string[];
  whyItMatters: string;

  volunteerSpots: number;
  minimumAge: number;
  commitmentType: string;

  startDate: string;
  endDate: string;
  dailyHours: number;

  images: string[];
  coverImage: string;

  contactName: string;
  contactEmail: string;
  contactPhone: string | null;

  postedById: number;
  postedByName: string;

  status: string;
  createdAt: string;

  verification: {
    orgLegalName: string;
    orgType: string;
    orgAddress: string;
    regNumber: string;
    regAuthority: string;
    regDate: string | null;
    panNumber: string;
    website: string | null;
    officialEmail: string;
    officialPhone: string | null;
    authorizedSignatory: string;
    signatoryRole: string;

    documents: {
      id: number;
      documentType: string;
      fileName: string;
      file: string;
      contentType: string;
    }[];
  };
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
  const [volunteers, setVolunteers] = useState<VolunteerRequest[]>([]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  useEffect(() => {
    const fetchVolunteers = async () => {
      setLoadingVolunteers(true);

      try {
        const data = await getVolunteerOpportunities();

        // backend returns Page OR array depending on your API
        const list = Array.isArray(data)
          ? data
          : data?.content ?? [];

        setVolunteers(list || []);
      } catch (err: any) {
        toast.error("Failed to load volunteer requests: " + err.message);
      }

      setLoadingVolunteers(false);
    };

    fetchVolunteers();
  }, []);

  const handleApprove = async (id: number) => {
    setProcessingId(id);
  
    try {
      await updateVolunteerStatus(id, "ACTIVE");
  
      toast.success("Volunteer request approved!");
  
      setVolunteers((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, status: "ACTIVE" } : v
        )
      );
    } catch (err: any) {
      toast.error("Failed to approve: " + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setProcessingId(id);
  
    try {
      await updateVolunteerStatus(id, "REJECTED");
  
      toast.success("Volunteer request rejected.");
  
      setVolunteers((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, status: "REJECTED" } : v
        )
      );
    } catch (err: any) {
      toast.error("Failed to reject: " + err.message);
    } finally {
      setProcessingId(null);
    }
  };
  const handlePreview = async (
    docId: number,
    fileName: string,
    contentType?: string
  ) => {
    try {
      const res = await api.get(
        `/admin/volunteer-opportunities/documents/${docId}`,
        { responseType: "blob" }
      );

      const rawHeader = res.headers["content-type"];

      const mime =
        typeof rawHeader === "string"
          ? rawHeader
          : Array.isArray(rawHeader)
            ? rawHeader[0]
            : contentType || "";

      const blob = new Blob([res.data], { type: mime });

      const url = window.URL.createObjectURL(blob);
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 60_000);
      const ext = fileName.split(".").pop()?.toLowerCase();

      // 📄 PDF → open in new tab
      if (mime.includes("pdf") || ext === "pdf") {
        window.open(url, "_blank");
        return;
      }

      // 🧾 DOCX / DOC → download
      if (ext === "docx" || ext === "doc") {
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        return;
      }

      // 📝 TXT / CSV / JSON → open as text
      if (
        mime.startsWith("text/") ||
        ext === "txt" ||
        ext === "csv" ||
        ext === "json"
      ) {
        const textUrl = url;
        window.open(textUrl, "_blank");
        return;
      }

      // 🖼 IMAGE → modal preview
      if (mime.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(blob);
        return;
      }

      toast.error("Unsupported file type");
    } catch (err) {
      toast.error("Failed to load document");
    }
  };
  const openDetails = (v: VolunteerRequest) => {
    setSelectedVolunteer(v);
    setDialogOpen(true);
  };

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
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="approvals" className="gap-1"><Clock className="h-4 w-4" /> Approvals</TabsTrigger>
            <TabsTrigger value="flagged" className="gap-1"><Flag className="h-4 w-4" /> Flagged</TabsTrigger>
            <TabsTrigger value="users" className="gap-1"><Users className="h-4 w-4" /> Users</TabsTrigger>
            <TabsTrigger value="transactions" className="gap-1"><BarChart3 className="h-4 w-4" /> Transactions</TabsTrigger>
          </TabsList>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pending Campaign Approvals</CardTitle>
                <CardDescription>Review and approve new campaign submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Goal (NPR)</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingCampaigns.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.title}</TableCell>
                        <TableCell>{c.org}</TableCell>
                        <TableCell><Badge variant="outline">{c.category}</Badge></TableCell>
                        <TableCell>{c.goalAmount.toLocaleString()}</TableCell>
                        <TableCell>{c.submittedDate}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"><CheckCircle className="h-4 w-4" /></Button>
                          <Button size="sm" variant="destructive"><XCircle className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pending Volunteer Requests</CardTitle>
                <CardDescription>Review new volunteer opportunity submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingVolunteers ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading volunteer requests...
                  </div>
                ) : volunteers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    No volunteer requests yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Opportunity</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Spots</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {volunteers.map((v) => (
                        <TableRow key={v.id}>
                          <TableCell className="font-medium">{v.title}</TableCell>
                          <TableCell>{v.verification.orgLegalName}</TableCell>
                          <TableCell><Badge variant="outline">{v.category}</Badge></TableCell>
                          <TableCell>{v.volunteerSpots}</TableCell>
                          <TableCell>{statusBadge(v.status)}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button size="sm" variant="ghost" onClick={() => openDetails(v)}><Eye className="h-4 w-4" /></Button>
                            {v.status === "PENDING_REVIEW" && (
                              <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" disabled={processingId === v.id} onClick={() => handleApprove(v.id)}>
                                  {processingId === v.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                </Button>
                                <Button size="sm" variant="destructive" disabled={processingId === v.id} onClick={() => handleReject(v.id)}>
                                  {processingId === v.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading">Volunteer Request Details</DialogTitle>
            <DialogDescription>
              Full review data for this volunteer opportunity submission.
            </DialogDescription>
          </DialogHeader>
          {selectedVolunteer && (
            <div className="space-y-6 text-sm">
              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Status:</span>
                {statusBadge(selectedVolunteer.status)}
              </div>

              {/* Basic Info */}
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" /> Opportunity
                </h4>
                <p className="font-medium text-lg">{selectedVolunteer.title}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline">{selectedVolunteer.category}</Badge>
                  <span className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    <MapPin className="h-3 w-3" /> {selectedVolunteer.location}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    <Users className="h-3 w-3" /> {selectedVolunteer.volunteerSpots} spots
                  </span>
                </div>
                <h4 className="font-semibold text-foreground">Description</h4>
                <p className="text-muted-foreground leading-relaxed">{selectedVolunteer.description}</p>
                <h4 className="font-semibold text-foreground">Long description</h4>
                <p className="text-muted-foreground leading-relaxed">{selectedVolunteer.longDescription}</p>
              </div>

              <Separator />

              {/* Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground flex items-center gap-1 mb-1">
                    <Calendar className="h-3 w-3" /> Dates
                  </p>
                  <p className="font-medium text-foreground">
                    {selectedVolunteer.startDate} — {selectedVolunteer.endDate}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1 mb-1">
                    <Clock className="h-3 w-3" /> Daily Hours
                  </p>
                  <p className="font-medium text-foreground">{selectedVolunteer.dailyHours} hrs/day</p>
                </div>
              </div>

              {/* Skills & Requirements */}
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Requirements</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVolunteer.requiredSkills?.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
                <p className="text-muted-foreground">Min age: {selectedVolunteer.minimumAge}</p>
                <p className="text-muted-foreground"> Commitment: {selectedVolunteer.commitmentType}</p>
                <h4 className="font-semibold text-foreground"> Additional Requirements:</h4>
                {selectedVolunteer.requirements && (
                  <p className="text-muted-foreground">{selectedVolunteer.requirements?.map((req, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </span>

                      <span className="text-sm text-foreground">{req}</span>
                    </div>
                  ))}</p>
                )}
              </div>

              {/* Activities, Impact, Benefits */}
              {selectedVolunteer.activities && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-primary" /> What Volunteers Will Do
                  </h4>
                  <ul className="space-y-1 list-disc pl-5 text-muted-foreground">
                    {selectedVolunteer.activities?.filter(item => item.trim() !== "")
                      .map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-muted-foreground"
                        >
                          <CheckCircle
                            size={14}
                            className="text-primary mt-1 shrink-0"
                          />

                          <span>{item}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
              {selectedVolunteer.whyItMatters && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" /> Why This Matters
                  </h4>
                  <p className="text-muted-foreground whitespace-pre-line">{selectedVolunteer.whyItMatters}</p>
                </div>
              )}
              {selectedVolunteer.benefits && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" /> What Volunteers Get
                  </h4>
                  <ul className="space-y-1 list-disc pl-5 text-muted-foreground">
                    {selectedVolunteer.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                        <CheckCircle size={14} className="text-primary mt-0.5 shrink-0" />
                        <span className="text-sm text-foreground">{benefit}</span>
                      </div>
                    ))}
                  </ul>
                </div>
              )}
              {selectedVolunteer.coverImage && (
                <img
                  src={`data:image/jpeg;base64,${selectedVolunteer.coverImage}`}
                  className="w-full h-60 object-cover rounded-lg"
                />
              )}
              {selectedVolunteer.images?.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                    Photos
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {selectedVolunteer.images.slice(0, 4).map((src, i) => (
                      <motion.img
                        key={i}
                        src={`data:image/jpeg;base64,${src}`}
                        alt={`${selectedVolunteer.title} photo ${i + 1}`}
                        loading="lazy"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => setSelectedImage(`data:image/jpeg;base64,${src}`)}
                        className="w-full h-40 sm:h-48 object-cover rounded-lg border border-border"
                      />
                    ))}
                  </div>
                </div>
              )}
              <Separator />

              {/* Contact */}
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Contact Information
                </h4>
                <p className="font-medium text-foreground">{selectedVolunteer.contactName}</p>
                <div className="flex flex-wrap gap-3 text-muted-foreground">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {selectedVolunteer.contactEmail}</span>
                  {selectedVolunteer.contactPhone && (
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {selectedVolunteer.contactPhone}</span>
                  )}
                </div>
              </div>

              {/* Organization Verification */}
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> Organization Verification
                </h4>
                <p className="font-medium text-foreground">Organization Name:{selectedVolunteer.verification.orgLegalName}</p>
                <p className="text-muted-foreground">
                  Org type:{selectedVolunteer.verification.orgType}
                </p>
                <p className="text-muted-foreground">
                  Registraion Number: {selectedVolunteer.verification.regNumber}
                </p>
                <p className="text-muted-foreground">
                  Authority: {selectedVolunteer.verification.regAuthority}
                </p>
                {selectedVolunteer.verification.regDate && (
                  <p className="text-muted-foreground">Registered: {selectedVolunteer.verification.regDate}</p>
                )}
                <p className="text-muted-foreground">PAN: {selectedVolunteer.verification.panNumber}</p>
                {selectedVolunteer.verification.website && (
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Globe className="h-3 w-3" /> {selectedVolunteer.verification.website}
                  </p>
                )}
                <p className="text-muted-foreground">
                  Signatory: {selectedVolunteer.verification.authorizedSignatory} ({selectedVolunteer.verification.signatoryRole})
                </p>
                {selectedVolunteer.verification.documents?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedVolunteer.verification.documents.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() =>
                          handlePreview(doc.id, doc.fileName, doc.contentType)
                        }
                        className="text-[11px] bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1 hover:bg-primary/20"
                      >
                        <FileCheck className="h-3 w-3" />
                        {doc.fileName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Submitted info */}
              <div className="pt-2 text-xs text-muted-foreground">
                Submitted on {new Date(selectedVolunteer.createdAt).toLocaleDateString()} by {selectedVolunteer.postedByName}.
              </div>

              {/* Actions */}
              {selectedVolunteer.status === "PENDING_REVIEW" && (
                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    disabled={processingId === selectedVolunteer.id}
                    onClick={() => { handleApprove(selectedVolunteer.id); setDialogOpen(false); }}
                  >
                    {processingId === selectedVolunteer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={processingId === selectedVolunteer.id}
                    onClick={() => { handleReject(selectedVolunteer.id); setDialogOpen(false); }}
                  >
                    {processingId === selectedVolunteer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-2">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>

          {previewUrl && (
            <div className="w-full h-[75vh]">
              {/* Try PDF/Image both */}
              <object
                data={previewUrl}
                type="application/pdf"
                className="w-full h-[75vh] border rounded-md"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ImageModal
        open={!!selectedImage}
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default AdminDashboard;
