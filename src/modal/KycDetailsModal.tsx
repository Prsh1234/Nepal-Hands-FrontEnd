import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  
  import {
    User,
    Mail,
    Phone,
    FileText,
    MapPin,
    FileCheck,
    Loader2,
    CheckCircle,
    XCircle,
  } from "lucide-react";
  
  import { Separator } from "@radix-ui/react-separator";
  
  import type { KycRecord } from "@/types/kyc";
  
  type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  
    selectedKyc: KycRecord | null;
  
    selectedImage: string | null;
    setSelectedImage: (value: string | null) => void;
  
    statusBadge: (status: string) => React.ReactNode;
  
    rejectReason: string;
    setRejectReason: (value: string) => void;
  
    kycProcessingId: string | null;
    openApproveConfirm: (id: string) => void;
    openRejectConfirm: (id: string) => void;
    handleKycApprove: (id: string) => void;
    handleKycReject: (id: string, reason: string) => void;
  };
  
  const KycDetailsModal = ({
    open,
    onOpenChange,
    selectedKyc,
    selectedImage,
    setSelectedImage,
    statusBadge,
    rejectReason,
    setRejectReason,
    kycProcessingId,
    handleKycApprove,
    handleKycReject,
    openApproveConfirm,
    openRejectConfirm,
  }: Props) => {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading">
              KYC Verification Details
            </DialogTitle>
  
            <DialogDescription>
              Review the applicant's identity information and documents.
            </DialogDescription>
          </DialogHeader>
  
          {selectedKyc && (
            <div className="space-y-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Status:</span>
                {statusBadge(selectedKyc.status)}
              </div>
  
              {/* Personal Information */}
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Personal Information
                </h4>
  
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-muted-foreground">Full Name:</span>{" "}
                    <span className="font-medium">
                      {selectedKyc.fullName}
                    </span>
                  </div>
  
                  <div>
                    <span className="text-muted-foreground">DOB:</span>{" "}
                    <span className="font-medium">
                      {selectedKyc.dateOfBirth}
                    </span>
                  </div>
  
                  <div>
                    <span className="text-muted-foreground">Gender:</span>{" "}
                    <span className="font-medium capitalize">
                      {selectedKyc.gender}
                    </span>
                  </div>
  
                  <div>
                    <span className="text-muted-foreground">Occupation:</span>{" "}
                    <span className="font-medium">
                      {selectedKyc.occupation}
                    </span>
                  </div>
  
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    {selectedKyc.email}
                  </div>
  
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    {selectedKyc.phoneNumber}
                  </div>
                </div>
              </div>
  
              <Separator />
  
              {/* Citizenship */}
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Citizenship & PAN
                </h4>
  
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-muted-foreground">
                      Citizenship #:
                    </span>{" "}
                    <span className="font-medium">
                      {selectedKyc.citizenshipNumber}
                    </span>
                  </div>
  
                  <div>
                    <span className="text-muted-foreground">
                      Issued District:
                    </span>{" "}
                    <span className="font-medium">
                      {selectedKyc.citizenshipIssuedDistrict}
                    </span>
                  </div>
  
                  <div>
                    <span className="text-muted-foreground">
                      Issued Date:
                    </span>{" "}
                    <span className="font-medium">
                      {selectedKyc.citizenshipIssuedDate}
                    </span>
                  </div>
  
                  <div>
                    <span className="text-muted-foreground">PAN:</span>{" "}
                    <span className="font-medium">
                      {selectedKyc.panNumber || "—"}
                    </span>
                  </div>
                </div>
              </div>
  
              <Separator />
  
              {/* Address */}
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Address
                </h4>
  
                <p className="text-muted-foreground">
                  {selectedKyc.province}, {selectedKyc.district},{" "}
                  {selectedKyc.municipality}, Ward{" "}
                  {selectedKyc.wardNumber}
                  {selectedKyc.tole
                    ? `, ${selectedKyc.tole}`
                    : ""}
                </p>
  
                <p>
                  <span className="text-muted-foreground">
                    Permanent:
                  </span>{" "}
                  {selectedKyc.permanentAddress}
                </p>
  
                {selectedKyc.temporaryAddress && (
                  <p>
                    <span className="text-muted-foreground">
                      Temporary:
                    </span>{" "}
                    {selectedKyc.temporaryAddress}
                  </p>
                )}
  
                <p>
                  <span className="text-muted-foreground">
                    Source of Funds:
                  </span>{" "}
                  {selectedKyc.sourceOfFunds}
                </p>
              </div>
  
              <Separator />
  
              {/* Documents */}
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-primary" />
                  Submitted Documents
                </h4>
  
                <div className="space-y-4">
                  {selectedKyc.citizenshipFront && (
                    <DocumentPreview
                      title="Citizenship Front"
                      image={selectedKyc.citizenshipFront}
                      setSelectedImage={setSelectedImage}
                    />
                  )}
  
                  {selectedKyc.citizenshipBack && (
                    <DocumentPreview
                      title="Citizenship Back"
                      image={selectedKyc.citizenshipBack}
                      setSelectedImage={setSelectedImage}
                    />
                  )}
  
                  {selectedKyc.panDocument && (
                    <DocumentPreview
                      title="PAN Document"
                      image={selectedKyc.panDocument}
                      setSelectedImage={setSelectedImage}
                    />
                  )}
                </div>
              </div>
  
              <div className="pt-2 text-xs text-muted-foreground">
                Submitted on{" "}
                {new Date(
                  selectedKyc.createdAt
                ).toLocaleDateString()}
              </div>
  
              {selectedKyc.status === "PENDING" && (
                <div className="space-y-3 pt-2">
                  <Input
                    placeholder="Rejection reason (required if rejecting)"
                    value={rejectReason}
                    onChange={(e) =>
                      setRejectReason(e.target.value)
                    }
                  />
  
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      disabled={kycProcessingId === selectedKyc.id}
                      onClick={() => {
                        openApproveConfirm(selectedKyc.id);
                        onOpenChange(false);
                      }}
                    >
                      {kycProcessingId === selectedKyc.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
  
                      Approve
                    </Button>
  
                    <Button
                      variant="destructive"
                      className="flex-1"
                      disabled={kycProcessingId === selectedKyc.id}
                      onClick={() => {
                        openRejectConfirm(selectedKyc.id);
  
                        onOpenChange(false);
                      }}
                    >
                      {kycProcessingId === selectedKyc.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-1" />
                      )}
  
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };
  
  const DocumentPreview = ({
    title,
    image,
    setSelectedImage,
  }: any) => {
    return (
      <div className="flex items-start gap-4">
        <p className="w-60 text-sm font-medium text-muted-foreground">
          {title}
        </p>
  
        <img
          src={`data:image/jpeg;base64,${image}`}
          className="w-60 h-28 object-cover rounded-lg cursor-pointer border"
          onClick={() =>
            setSelectedImage(
              `data:image/jpeg;base64,${image}`
            )
          }
        />
      </div>
    );
  };
  
  export default KycDetailsModal;