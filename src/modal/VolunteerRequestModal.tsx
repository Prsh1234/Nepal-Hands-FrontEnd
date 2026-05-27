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
import type { VolunteerRequest } from "@/types/volunteer";
import {
    Briefcase,
    MapPin,
    Users,
    Calendar,
    Clock,
    CheckCircle,
    User,
    Mail,
    Phone,
    Building2,
    Globe,
    FileCheck,
    Loader2,
    XCircle,
    Sparkles,
    Star,
    ListChecks,
} from "lucide-react";

import ImageModal from "@/modal/ImageModal";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedVolunteer: VolunteerRequest | null;
    processingId: number | null;
    selectedImage: string | null;
    setSelectedImage: (value: string | null) => void;
    statusBadge: (status: string) => React.ReactNode;
    handleApprove: (id: number) => void;
    handleReject: (id: number) => void;
    handlePreview: (
        docId: number,
        fileName: string,
        contentType?: string
    ) => void;
    openApproveConfirm: (id: number) => void;
    openRejectConfirm: (id: number) => void;
};

const VolunteerRequestModal = ({
    open,
    onOpenChange,
    selectedVolunteer,
    processingId,
    selectedImage,
    setSelectedImage,
    statusBadge,
    openApproveConfirm,
    openRejectConfirm,
    handlePreview,
}: Props) => {
    if (!selectedVolunteer) return null;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-heading">
                            Volunteer Request Details
                        </DialogTitle>

                        <DialogDescription>
                            Full review data for this volunteer opportunity submission.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Status:</span>
                            {statusBadge(selectedVolunteer.status)}
                        </div>

                        {/* Opportunity */}
                        <div className="space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-primary" />
                                Opportunity
                            </h4>

                            <p className="font-medium text-lg">
                                {selectedVolunteer.title}
                            </p>

                            <div className="flex flex-wrap gap-2 text-xs">
                                <Badge variant="outline">
                                    {selectedVolunteer.category}
                                </Badge>

                                <span className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    <MapPin className="h-3 w-3" />
                                    {selectedVolunteer.location}
                                </span>

                                <span className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    <Users className="h-3 w-3" />
                                    {selectedVolunteer.volunteerSpots} spots
                                </span>
                            </div>

                            <h4 className="font-semibold">Description</h4>

                            <p className="text-muted-foreground">
                                {selectedVolunteer.description}
                            </p>
                        </div>

                        <Separator />

                        {/* Schedule */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-muted-foreground flex items-center gap-1 mb-1">
                                    <Calendar className="h-3 w-3" />
                                    Dates
                                </p>

                                <p className="font-medium">
                                    {selectedVolunteer.startDate} —{" "}
                                    {selectedVolunteer.endDate}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground flex items-center gap-1 mb-1">
                                    <Clock className="h-3 w-3" />
                                    Daily Hours
                                </p>

                                <p className="font-medium">
                                    {selectedVolunteer.dailyHours} hrs/day
                                </p>
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
                        {/* Images */}
                        {selectedVolunteer.coverImage && (
                            <img
                                src={`data:image/jpeg;base64,${selectedVolunteer.coverImage}`}
                                className="w-full h-60 object-cover rounded-lg"
                            />
                        )}
                        {selectedVolunteer.images?.length > 0 && (
                            <div className="grid grid-cols-2 gap-3">
                                {selectedVolunteer.images.map((src: string, i: number) => (
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

                        {/* Contact */}
                        <div className="space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                Contact Information
                            </h4>

                            <p>{selectedVolunteer.contactName}</p>

                            <div className="flex flex-wrap gap-3 text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {selectedVolunteer.contactEmail}
                                </span>

                                {selectedVolunteer.contactPhone && (
                                    <span className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {selectedVolunteer.contactPhone}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Verification */}
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
                                <div className="flex flex-col gap-2 pt-1">
                                    {selectedVolunteer.verification.documents.map((doc) => (
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
                            Submitted on {new Date(selectedVolunteer.createdAt).toLocaleDateString()} by {selectedVolunteer.postedByName}.
                        </div>
                        {/* Actions */}
                        {selectedVolunteer.status === "PENDING_REVIEW" && (
                            <div className="flex gap-3 pt-2">
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    disabled={processingId === selectedVolunteer.id}
                                    onClick={() => {
                                        openApproveConfirm(selectedVolunteer.id);
                                    }}
                                >
                                    {processingId === selectedVolunteer.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                    )}

                                    Approve
                                </Button>

                                <Button
                                    variant="destructive"
                                    className="flex-1"
                                    disabled={processingId === selectedVolunteer.id}
                                    onClick={() => {
                                        openRejectConfirm(selectedVolunteer.id);
                                    }}
                                >
                                    {processingId === selectedVolunteer.id ? (
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

export default VolunteerRequestModal;