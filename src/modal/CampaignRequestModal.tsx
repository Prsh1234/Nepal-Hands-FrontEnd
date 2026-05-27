import { motion } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { CampaignRequest } from "@/types/campaign";

import {
    Briefcase,
    MapPin,
    Users,
    Calendar,
    Clock,
    User,
    Mail,
    Phone,
    Building2,
    Globe,
    FileCheck,
    Loader2,
    CheckCircle,
    XCircle,
    ListChecks,
} from "lucide-react";
import ImageModal from "./ImageModal";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCampaign: CampaignRequest | null;

    processingCampaignId: number | null;   // ✅ add this
    statusBadge: (status: string) => React.ReactNode;

    selectedImage: string | null;
    setSelectedImage: (value: string | null) => void;

    handlePreview: (docId: number, fileName: string, contentType?: string) => void;

    openApproveConfirm: (id: number) => void;
    openRejectConfirm: (id: number) => void;
};

const CampaignRequestModal = ({
    open,
    onOpenChange,
    selectedCampaign,
    processingCampaignId,
    selectedImage,
    setSelectedImage,
    statusBadge,
    handlePreview,
    openApproveConfirm,
    openRejectConfirm,
}: Props) => {
    if (!selectedCampaign) return null;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-heading">
                            Campaign Request Details
                        </DialogTitle>
                        <DialogDescription>
                            Full review data for this campaign submission.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 text-sm">
                        {/* Status */}
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Status:</span>
                            {statusBadge(selectedCampaign.status)}
                        </div>

                        {/* Campaign Info */}
                        <div className="space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-primary" />
                                Campaign
                            </h4>
                            <p className="font-medium text-lg">Organized By: {selectedCampaign.organizer}</p>

                            <p className="font-medium text-lg">{selectedCampaign.title}</p>

                            <div className="flex flex-wrap gap-2 text-xs">
                                <Badge variant="outline">{selectedCampaign.category}</Badge>

                                <span className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    <MapPin className="h-3 w-3" />
                                    {selectedCampaign.location}
                                </span>

                                <span className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    Goal: NPR {selectedCampaign.goal}
                                </span>
                            </div>

                            <h4 className="font-semibold mt-3">Description</h4>
                            <p className="text-muted-foreground">
                                {selectedCampaign.description}
                            </p>

                            {selectedCampaign.longDescription && (
                                <p className="text-muted-foreground mt-2">
                                    {selectedCampaign.longDescription}
                                </p>
                            )}
                        </div>

                        <Separator />

                        {/* Skills & Requirements */}
                        <div className="space-y-2">
                        
                            
                        {selectedCampaign.projectScope && (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-foreground flex items-center gap-2">
                                    <ListChecks className="h-4 w-4 text-primary" /> Project Scope
                                </h4>
                                <ul className="space-y-1 list-disc pl-5 text-muted-foreground">
                                    {selectedCampaign.projectScope?.filter(item => item.trim() !== "")
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
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-muted-foreground flex items-center gap-1 mb-1">
                                    <Calendar className="h-3 w-3" />
                                    Duration
                                </p>
                                <p className="font-medium">
                                    {selectedCampaign.startDate} — {selectedCampaign.endDate}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground flex items-center gap-1 mb-1">
                                    <Clock className="h-3 w-3" />
                                    Created
                                </p>
                                <p className="font-medium">{selectedCampaign.createdAt}</p>
                            </div>
                        </div>
                        {/* Images */}
                        {selectedCampaign.coverImage && (
                            <img
                                src={`data:image/jpeg;base64,${selectedCampaign.coverImage}`}
                                className="w-full h-60 object-cover rounded-lg"
                            />
                        )}
                        {selectedCampaign.images?.length > 0 && (
                            <div className="grid grid-cols-2 gap-3">
                                {selectedCampaign.images.map((src: string, i: number) => (
                                    <motion.img
                                        key={i}
                                        src={`data:image/jpeg;base64,${src}`}
                                        className="w-full h-40 object-cover rounded-lg border"
                                        onClick={() =>
                                            setSelectedImage(
                                                `data:image/jpeg;base64,${src}`
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        )}

                        <Separator />
                        <Separator />

                        {/* Contact */}
                        <div>
                            <h4 className="font-semibold flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                Contact
                            </h4>

                            <p>{selectedCampaign.contactName}</p>

                            <div className="flex flex-wrap gap-3 text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {selectedCampaign.contactEmail}
                                </span>

                                {selectedCampaign.contactPhone && (
                                    <span className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {selectedCampaign.contactPhone}
                                    </span>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Verification */}
                        {/* Organization Verification */}
                        <div className="space-y-2">
                            <h4 className="font-semibold text-foreground flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-primary" /> Organization Verification
                            </h4>
                            <p className="font-medium text-foreground">Organization Name:{selectedCampaign.verification.orgLegalName}</p>
                            <p className="text-muted-foreground">
                                Org type:{selectedCampaign.verification.orgType}
                            </p>
                            <p className="text-muted-foreground">
                                Registraion Number: {selectedCampaign.verification.regNumber}
                            </p>
                            <p className="text-muted-foreground">
                                Authority: {selectedCampaign.verification.regAuthority}
                            </p>
                            {selectedCampaign.verification.regDate && (
                                <p className="text-muted-foreground">Registered: {selectedCampaign.verification.regDate}</p>
                            )}
                            <p className="text-muted-foreground">PAN: {selectedCampaign.verification.panNumber}</p>
                            {selectedCampaign.verification.website && (
                                <p className="text-muted-foreground flex items-center gap-1">
                                    <Globe className="h-3 w-3" /> {selectedCampaign.verification.website}
                                </p>
                            )}
                            <p className="text-muted-foreground">
                                Signatory: {selectedCampaign.verification.authorizedSignatory} ({selectedCampaign.verification.signatoryRole})
                            </p>
                            <p className="text-muted-foreground">
                                Bank Name: {selectedCampaign.verification.authorizedSignatory} ({selectedCampaign.verification.bankName})
                            </p>
                            <p className="text-muted-foreground">
                                Bank Account Holder: {selectedCampaign.verification.authorizedSignatory} ({selectedCampaign.verification.bankAccountHolderName})
                            </p>
                            <p className="text-muted-foreground">
                                Bank Account Number: {selectedCampaign.verification.authorizedSignatory} ({selectedCampaign.verification.bankAccountNumber})
                            </p>
                            {selectedCampaign.verification.documents?.length > 0 && (
                                <div className="flex flex-col gap-2 pt-1">
                                    {selectedCampaign.verification.documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="flex items-center gap-2 flex-wrap"
                                        >
                                            <p className="text-sm text-foreground min-w-[140px]">
                                                {doc.documentType}
                                            </p>

                                            <button
                                                onClick={() =>
                                                    handlePreview(doc.id, doc.fileName, doc.contentType)
                                                }
                                                className="text-[11px] bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1 hover:bg-primary/20"
                                            >
                                                <FileCheck className="h-3 w-3" />
                                                {doc.fileName}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Submitted info */}
                        <div className="pt-2 text-xs text-muted-foreground">
                            Submitted on {new Date(selectedCampaign.createdAt).toLocaleDateString()} by {selectedCampaign.postedByName}.
                        </div>
                        {/* Actions */}
                        {selectedCampaign.status === "PENDING_REVIEW" && (
                            <div className="flex gap-3 pt-2">
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    disabled={processingCampaignId === selectedCampaign.id}
                                    onClick={() =>
                                        openApproveConfirm(selectedCampaign.id)
                                    }
                                >
                                    {processingCampaignId === selectedCampaign.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                    )}
                                    Approve
                                </Button>

                                <Button
                                    variant="destructive"
                                    className="flex-1"
                                    disabled={processingCampaignId === selectedCampaign.id}
                                    onClick={() =>
                                        openRejectConfirm(selectedCampaign.id)
                                    }
                                >
                                    {processingCampaignId === selectedCampaign.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <XCircle className="h-4 w-4 mr-1" />
                                    )}
                                    Reject
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            <ImageModal
                open={!!selectedImage}
                image={selectedImage}
                onClose={() => setSelectedImage(null)}
            />
        </>
    );
};

export default CampaignRequestModal;