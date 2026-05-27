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
} from "lucide-react";
import {
  getVolunteerOpportunities,
  updateVolunteerStatus,
  getCampaigns,
  updateCampaignStatus,
  getKycs,
  updateKycStatus,
} from "@/services/adminService";
import api from "@/lib/api";
import ImageModal from "@/modal/ImageModal";
import VolunteerRequestModal from "@/modal/VolunteerRequestModal";
import CampaignRequestModal from "@/modal/CampaignRequestModal";
import KycDetailsModal from "@/modal/KycDetailsModal";
import type { VolunteerRequest } from "@/types/volunteer";
import ConfirmationModal from "@/modal/ConfirmationModal";
import { CampaignRequest } from "@/types/campaign";
import { KycRecord } from "@/types/kyc";

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

  const [volunteers, setVolunteers] = useState<VolunteerRequest[]>([]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerRequest | null>(null);

  const [campaigns, setCampaigns] = useState<CampaignRequest[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignRequest | null>(null);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [VolunteerdialogOpen, setVolunteerDialogOpen] = useState(false);
  const [processingVolunteerId, setProcessingVolunteerId] = useState<number | null>(null);
  const [processingCampaignId, setProcessingCampaignId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  const [kycList, setKycList] = useState<KycRecord[]>([]);
  const [loadingKyc, setLoadingKyc] = useState(true);
  const [selectedKyc, setSelectedKyc] = useState<KycRecord | null>(null);
  const [kycDialogOpen, setKycDialogOpen] = useState(false);
  const [kycProcessingId, setKycProcessingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {

    const fetchCampaigns = async () => {
      setLoadingCampaigns(true);
      try {
        const data = await getCampaigns();
        const list = Array.isArray(data) ? data : data?.content ?? [];
        setCampaigns(list);
      } catch (err: any) {
        toast.error("Failed to load campaigns: " + err.message);
      }
      setLoadingCampaigns(false);
    };

    fetchCampaigns();

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
    const fetchKyc = async () => {
      setLoadingKyc(true);

      try {
        const data = await getKycs({
          status: "PENDING",
          page: 0,
          size: 10,
        });

        console.log(data);

        setKycList(data?.content ?? []);
      } catch (err: any) {
        toast.error("Failed to load KYC requests: " + err.message);
      }

      setLoadingKyc(false);
    };
    fetchKyc();


  }, []);
  const handleCampaignApprove = async (id: number) => {
    setProcessingCampaignId(id);

    try {
      await updateCampaignStatus(id, "ACTIVE");
      toast.success("Campaign approved!");

      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "ACTIVE" } : c
        )
      );
    } catch (err: any) {
      toast.error("Failed to approve campaign: " + err.message);
    } finally {
      setProcessingCampaignId(null);
    }
  };
  const handleCampaignReject = async (id: number) => {
    setProcessingCampaignId(id);

    try {
      await updateCampaignStatus(id, "REJECTED");
      toast.success("Campaign rejected!");

      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "REJECTED" } : c
        )
      );
    } catch (err: any) {
      toast.error("Failed to reject campaign: " + err.message);
    } finally {
      setProcessingCampaignId(null);
    }
  };

  const handleVolunteerApprove = async (id: number) => {
    setProcessingVolunteerId(id);

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
      setProcessingVolunteerId(null);
    }
  };

  const handleVolunteerReject = async (id: number) => {
    setProcessingVolunteerId(id);

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
      setProcessingVolunteerId(null);
    }
  };



  const openKycDetails = async (k: KycRecord) => {
    setSelectedKyc(k);
    setKycDialogOpen(true);


  };

  const handleKycApprove = async (id: string) => {
    setKycProcessingId(id);

    try {
      await updateKycStatus(id, "APPROVED"); // or APPROVED
      toast.success("KYC approved");

      setKycList((prev) =>
        prev.map((k) =>
          k.id === id ? { ...k, status: "ACTIVE" } : k
        )
      );
    } catch (err: any) {
      toast.error("Failed to approve KYC: " + err.message);
    } finally {
      setKycProcessingId(null);
    }
  };
  const handleKycReject = async (id: string, reason: string) => {
    if (!reason.trim()) {
      toast.error("Rejection reason required");
      return;
    }

    setKycProcessingId(id);

    try {
      await updateKycStatus(id, "REJECTED", reason);

      toast.success("KYC rejected");

      setKycList((prev) =>
        prev.map((k) =>
          k.id === id ? { ...k, status: "REJECTED" } : k
        )
      );
    } catch (err: any) {
      toast.error("Failed to reject KYC: " + err.message);
    } finally {
      setKycProcessingId(null);
    }
  };






  const previewDocument = async (
    endpoint: string,
    fileName: string,
    contentType?: string
  ) => {
    try {
      const res = await api.get(endpoint, {
        responseType: "blob",
      });

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
      }, 60000);

      const ext = fileName.split(".").pop()?.toLowerCase();

      if (mime.includes("pdf") || ext === "pdf") {
        window.open(url, "_blank");
        return;
      }

      if (ext === "docx" || ext === "doc") {
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        return;
      }

      if (
        mime.startsWith("text/") ||
        ext === "txt" ||
        ext === "csv" ||
        ext === "json"
      ) {
        window.open(url, "_blank");
        return;
      }

      if (mime.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = () => {
          setSelectedImage(reader.result as string);
        };

        reader.readAsDataURL(blob);
        return;
      }

      toast.error("Unsupported file type");
    } catch {
      toast.error("Failed to load document");
    }
  };
  const handleCampaignDocumentPreview = (
    docId: number,
    fileName: string,
    contentType?: string
  ) => {
    return previewDocument(
      `/admin/campaign/documents/${docId}`,
      fileName,
      contentType
    );
  };

  const handleVolunteerDocumentPreview = (
    docId: number,
    fileName: string,
    contentType?: string
  ) => {
    return previewDocument(
      `/admin/volunteer-opportunities/documents/${docId}`,
      fileName,
      contentType
    );
  };
  const openVolunteerDetails = (v: VolunteerRequest) => {
    setSelectedVolunteer(v);
    setVolunteerDialogOpen(true);
  };
  const openCampaignDetails = (c: CampaignRequest) => {
    setSelectedCampaign(c);
    setCampaignDialogOpen(true);
  };
  type ConfirmType = "volunteer" | "campaign" | "kyc";
  const [confirmType, setConfirmType] = useState<ConfirmType>("volunteer");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);

  const [selectedVolunteerId, setSelectedVolunteerId] = useState<number | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [selectedKycId, setSelectedKycId] = useState<string | null>(null);

  const openCampaignApproveConfirm = (id: number) => {
    setConfirmType("campaign");
    setSelectedCampaignId(id);
    setConfirmAction("approve");
    setConfirmOpen(true);
  };

  const openCampaignRejectConfirm = (id: number) => {
    setConfirmType("campaign");
    setSelectedCampaignId(id);
    setConfirmAction("reject");
    setConfirmOpen(true);
  };


  const openVolunteerApproveConfirm = (id: number) => {
    setConfirmType("volunteer");
    setSelectedVolunteerId(id);
    setConfirmAction("approve");
    setConfirmOpen(true);
  };

  const openVolunteerRejectConfirm = (id: number) => {
    setConfirmType("volunteer");
    setSelectedVolunteerId(id);
    setConfirmAction("reject");
    setConfirmOpen(true);
  };


  const openKycApproveConfirm = (id: string) => {
    setConfirmType("kyc");
    setSelectedKycId(id);
    setConfirmAction("approve");
    setConfirmOpen(true);
  };

  const openKycRejectConfirm = (id: string) => {
    setConfirmType("kyc");
    setSelectedKycId(id);
    setConfirmAction("reject");
    setConfirmOpen(true);
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
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="approvals" className="gap-1"><Clock className="h-4 w-4" /> Approvals</TabsTrigger>
            <TabsTrigger value="kyc" className="gap-1"><BadgeCheck className="h-4 w-4" /> KYC</TabsTrigger>
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
                {loadingCampaigns ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading campaign requests...
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    No campaign requests yet.
                  </div>
                ) : (
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
                      {campaigns.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">{c.title}</TableCell>
                          <TableCell>{c.organizer}</TableCell>
                          <TableCell><Badge variant="outline">{c.category}</Badge></TableCell>
                          <TableCell>{c.goal.toLocaleString()}</TableCell>
                          <TableCell>{c.createdAt}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openCampaignDetails(c)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            {c.status === "PENDING_REVIEW" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => openCampaignApproveConfirm(c.id)}                              >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>

                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => openCampaignRejectConfirm(c.id)}                              >
                                  <XCircle className="h-4 w-4" />
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
                            <Button size="sm" variant="ghost" onClick={() => openVolunteerDetails(v)}><Eye className="h-4 w-4" /></Button>
                            {v.status === "PENDING_REVIEW" && (
                              <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" disabled={processingVolunteerId === v.id} onClick={() => openVolunteerApproveConfirm(v.id)}>
                                  {processingVolunteerId === v.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={processingVolunteerId === v.id}
                                  onClick={() => openVolunteerRejectConfirm(v.id)}
                                >
                                  {processingVolunteerId === v.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <XCircle className="h-4 w-4" />
                                  )}
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


          {/* Kyc Tab */}
          <TabsContent value="kyc">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">KYC Verifications</CardTitle>
                <CardDescription>Review identity verification submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingKyc ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading KYC submissions...
                  </div>
                ) : kycList.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">No KYC submissions yet.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Citizenship #</TableHead>
                        <TableHead>District</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {kycList.map((k) => (
                        <TableRow key={k.id}>
                          <TableCell className="font-medium">{k.fullName}</TableCell>
                          <TableCell className="text-sm">{k.citizenshipNumber}</TableCell>
                          <TableCell className="text-sm">{k.district}</TableCell>
                          <TableCell className="text-sm">{k.phoneNumber}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{new Date(k.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{statusBadge(k.status)}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button size="sm" variant="ghost" onClick={() => openKycDetails(k)}><Eye className="h-4 w-4" /></Button>
                            {k.status === "PENDING" && (
                              <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" disabled={kycProcessingId === k.id} onClick={() => openKycApproveConfirm(k.id)}>
                                  {kycProcessingId === k.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                </Button>
                                <Button size="sm" variant="destructive" disabled={kycProcessingId === k.id} onClick={() => openKycDetails(k)}>
                                  <XCircle className="h-4 w-4" />
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
      <VolunteerRequestModal
        open={VolunteerdialogOpen}
        onOpenChange={setVolunteerDialogOpen}
        selectedVolunteer={selectedVolunteer}
        processingVolunteerId={processingVolunteerId}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        handlePreview={handleVolunteerDocumentPreview}
        openApproveConfirm={openVolunteerApproveConfirm}
        openRejectConfirm={openVolunteerRejectConfirm}
        statusBadge={statusBadge}
      />
      <CampaignRequestModal
        open={campaignDialogOpen}
        onOpenChange={setCampaignDialogOpen}
        selectedCampaign={selectedCampaign}
        processingCampaignId={processingCampaignId}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        statusBadge={statusBadge}
        handlePreview={handleCampaignDocumentPreview}
        openApproveConfirm={openCampaignApproveConfirm}
        openRejectConfirm={openCampaignRejectConfirm}
      />

      <KycDetailsModal
        open={kycDialogOpen}
        onOpenChange={setKycDialogOpen}
        selectedKyc={selectedKyc}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        statusBadge={statusBadge}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        kycProcessingId={kycProcessingId}
        handleKycApprove={handleKycApprove}
        handleKycReject={handleKycReject}
        openApproveConfirm={openKycApproveConfirm}
        openRejectConfirm={openKycRejectConfirm}
      />
      <ImageModal
        open={!!selectedImage}
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
      <ConfirmationModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={
          confirmType === "campaign"
            ? confirmAction === "approve"
              ? "Approve Campaign"
              : "Reject Campaign"
            : confirmType === "volunteer"
            ? confirmAction === "approve"
              ? "Approve Volunteer Request"
              : "Reject Volunteer Request"
            : confirmAction === "approve"
            ? "Approve KYC"
            : "Reject KYC"
        }
        description={
          confirmType === "campaign"
            ? confirmAction === "approve"
              ? "Are you sure you want to approve this campaign?"
              : "Are you sure you want to reject this campaign?"
            : confirmType === "volunteer"
            ? confirmAction === "approve"
              ? "Are you sure you want to approve this volunteer request?"
              : "Are you sure you want to reject this volunteer request?"
            : confirmAction === "approve"
            ? "Are you sure you want to approve this KYC verification?"
            : "Are you sure you want to reject this KYC verification?"
        }
        confirmText={
          confirmAction === "approve"
            ? "Approve"
            : "Reject"
        }
        variant={
          confirmAction === "reject"
            ? "destructive"
            : "default"
        }
        loading={
          confirmType === "volunteer"
            ? processingVolunteerId === selectedVolunteerId
            : confirmType === "campaign"
            ? processingCampaignId === selectedCampaignId
            : kycProcessingId === selectedKycId
        }
        onConfirm={async () => {
          if (confirmType === "volunteer") {
            if (!selectedVolunteerId || !confirmAction) return;

            if (confirmAction === "approve") {
              await handleVolunteerApprove(selectedVolunteerId);
            } else {
              await handleVolunteerReject(selectedVolunteerId);
            }
          }

          if (confirmType === "campaign") {
            if (!selectedCampaignId || !confirmAction) return;

            if (confirmAction === "approve") {
              await handleCampaignApprove(selectedCampaignId);
            } else {
              await handleCampaignReject(selectedCampaignId);
            }
          }
          if (confirmType === "kyc") {
            if (!selectedKycId || !confirmAction) return;
          
            if (confirmAction === "approve") {
              await handleKycApprove(selectedKycId);
            } else {
              await handleKycReject(selectedKycId, rejectReason);
            }
          }

          setConfirmOpen(false);
        }}
      />

    </div>
  );
};

export default AdminDashboard;
