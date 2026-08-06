import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
    Eye, CheckCircle, XCircle, Loader2, Calendar, Clock, MapPin, Users, Briefcase,
    ListChecks, Sparkles, Star, User, Mail, Phone, Building2, Globe, FileCheck,
} from "lucide-react";
import {
    getVolunteerOpportunities,
    updateVolunteerStatus,
    getCampaigns,
    updateCampaignStatus
} from "@/services/adminService";
import api from "@/lib/api";
import ImageModal from "@/modal/ImageModal";
import VolunteerRequestModal from "@/modal/VolunteerRequestModal";
import CampaignRequestModal from "@/modal/CampaignRequestModal";
import type { VolunteerRequest } from "@/types/volunteer";
import ConfirmationModal from "@/modal/ConfirmationModal";
import { CampaignRequest } from "@/types/campaign";
import { formatDate } from "@/lib/utils";


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


const AdminApprovals = () => {


    const [volunteers, setVolunteers] = useState<VolunteerRequest[]>([]);
    const [loadingVolunteers, setLoadingVolunteers] = useState(true);
    const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerRequest | null>(null);

    const [campaigns, setCampaigns] = useState<CampaignRequest[]>([]);
    const [selectedCampaign, setSelectedCampaign] = useState<CampaignRequest | null>(null);
    const [loadingCampaigns, setLoadingCampaigns] = useState(true);

    const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
    const [VolunteerDialogOpen, setVolunteerDialogOpen] = useState(false);
    const [processingVolunteerId, setProcessingVolunteerId] = useState<number | null>(null);
    const [processingCampaignId, setProcessingCampaignId] = useState<number | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);



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
    // const deleteVolunteer = async (id: number) => {

    //   try {
    //     await deleteVolunteerOpportunity(id);

    //     toast.success("Volunteer request deleted!");

    //     setVolunteers((prev) =>
    //       prev.map((v) =>
    //         v.id === id ? { ...v, status: "ACTIVE" } : v
    //       )
    //     );
    //   } catch (err: any) {
    //     toast.error("Failed to approve: " + err.message);
    //   }
    // };

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
    type ConfirmType = "volunteer" | "campaign";
    const [confirmType, setConfirmType] = useState<ConfirmType>("volunteer");

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);

    const [selectedVolunteerId, setSelectedVolunteerId] = useState<number | null>(null);
    const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

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

    const modalConfig = {
        campaign: {
            approve: {
                title: "Approve Campaign",
                description: "Are you sure you want to approve this campaign?",
            },
            reject: {
                title: "Reject Campaign",
                description: "Are you sure you want to reject this campaign?",
            },
        },
        volunteer: {
            approve: {
                title: "Approve Volunteer Request",
                description: "Are you sure you want to approve this volunteer request?",
            },
            reject: {
                title: "Reject Volunteer Request",
                description: "Are you sure you want to reject this volunteer request?",
            },
        },
    };

    const currentConfig =
        confirmType && confirmAction
            ? modalConfig[confirmType][confirmAction]
            : {
                title: "",
                description: "",
            };
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-heading text-foreground">Approvals</h1>
                <p className="text-muted-foreground text-sm mt-1">Review pending campaign & volunteer opportunity submissions.</p>
            </div>

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
                                        <TableCell>{formatDate(c.createdAt)}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                id="view-campaign-details"
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => openCampaignDetails(c)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>

                                            {c.status === "PENDING_REVIEW" && (
                                                <>
                                                    <Button
                                                        id="table-approve-campaign"
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                        onClick={() => openCampaignApproveConfirm(c.id)}
                                                    >
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

            <VolunteerRequestModal
                open={VolunteerDialogOpen}
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
            <ImageModal
                open={!!selectedImage}
                image={selectedImage}
                onClose={() => setSelectedImage(null)}
            />
            <ConfirmationModal
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title={currentConfig.title}
                description={currentConfig.description}
                confirmText={confirmAction === "approve" ? "Approve" : "Reject"}
                variant={confirmAction === "reject" ? "destructive" : "default"}
                loading={
                    confirmType === "volunteer"
                        ? processingVolunteerId === selectedVolunteerId
                        : processingCampaignId === selectedCampaignId
                }
                onConfirm={async () => {
                    try {
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
                    } finally {
                        setConfirmOpen(false);
                    }
                }}
            />
        </div>
    );
};

export default AdminApprovals;