import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
    updateCampaignStatus,
    getKycs,
    updateKycStatus,
} from "@/services/adminService";
import api from "@/lib/api";
import ImageModal from "@/modal/ImageModal";
import KycDetailsModal from "@/modal/KycDetailsModal";
import ConfirmationModal from "@/modal/ConfirmationModal";
import { KycRecord } from "@/types/kyc";
import { toast } from "sonner";
import { Eye, CheckCircle, XCircle, Loader2, User, Mail, Phone, FileText, MapPin, FileCheck } from "lucide-react";

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
const AdminKyc = () => {

    const [kycList, setKycList] = useState<KycRecord[]>([]);
    const [loadingKyc, setLoadingKyc] = useState(true);
    const [selectedKyc, setSelectedKyc] = useState<KycRecord | null>(null);
    const [kycDialogOpen, setKycDialogOpen] = useState(false);
    const [kycProcessingId, setKycProcessingId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {

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


    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);

    const [selectedKycId, setSelectedKycId] = useState<string | null>(null);




    const openKycApproveConfirm = (id: string) => {
        setSelectedKycId(id);
        setConfirmAction("approve");
        setConfirmOpen(true);
    };

    const openKycRejectConfirm = (id: string) => {
        setSelectedKycId(id);
        setConfirmAction("reject");
        setConfirmOpen(true);
    };


    const modalConfig = {
        approve: {
            title: "Approve KYC",
            description: "Are you sure you want to approve this KYC verification?",
        },
        reject: {
            title: "Reject KYC",
            description: "Are you sure you want to reject this KYC verification?",
        },
    };

    const currentConfig = confirmAction
        ? modalConfig[confirmAction]
        : {
            title: "",
            description: "",
        };
    const handleConfirm = async () => {
        if (!selectedKycId || !confirmAction) return;

        try {
            if (confirmAction === "approve") {
                await handleKycApprove(selectedKycId);
            } else {
                await handleKycReject(selectedKycId, rejectReason);
            }
        } finally {
            setConfirmOpen(false);
        }
    };
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-heading text-foreground">KYC Verifications</h1>
                <p className="text-muted-foreground text-sm mt-1">Review identity verification submissions and approve or deny them.</p>
            </div>

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
                title={currentConfig.title}
                description={currentConfig.description}
                confirmText={confirmAction === "approve" ? "Approve" : "Reject"}
                variant={confirmAction === "reject" ? "destructive" : "default"}
                loading={kycProcessingId === selectedKycId}
                onConfirm={handleConfirm}
            />
        </div>
    );
};

export default AdminKyc;