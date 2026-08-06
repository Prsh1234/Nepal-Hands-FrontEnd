import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { Loader2, ShieldCheck, Upload, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { NEPAL_PROVINCES, OCCUPATIONS, SOURCE_OF_FUNDS } from "@/data/nepal-geo";
import Navbar from "@/components/Navbar";
import { createKyc, getMyKyc } from "@/services/kyc";

type FormState = {
    full_name: string;
    date_of_birth: string;
    gender: "Male" | "Female" | "Other";
  
    citizenship_number: string;
    citizenship_issued_district: string;
    citizenship_issued_date: string;
  
    pan_number: string;
  
    phone_number: string;
    email: string;
  
    province: string;
    district: string;
    municipality: string;
    ward_number: string;
  
    tole: string;
  
    permanent_address: string;
    temporary_address: string;
  
    occupation: string;
    source_of_funds: string;
  };

const initial: FormState = {
  full_name: "", date_of_birth: "", gender: "Male",
  citizenship_number: "", citizenship_issued_district: "", citizenship_issued_date: "",
  pan_number: "", phone_number: "", email: "",
  province: "", district: "", municipality: "", ward_number: "", tole: "",
  permanent_address: "", temporary_address: "", occupation: "", source_of_funds: "",
};

type FileSlot = "citizenship_front" | "citizenship_back" | "pan_document";

const Kyc = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existing, setExisting] = useState<{ status: string; rejection_reason: string | null } | null>(null);
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<FileSlot, File | null>>({
    citizenship_front: null, citizenship_back: null, pan_document: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyKyc();
  
        if (data) {
          setExisting({
            status: data.status.toLowerCase(),
            rejection_reason: data.rejectionReason,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const newErrors: Record<string, string> = {};
  
    if (!form.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }
  
    if (!form.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
    }
  
    if (!form.citizenship_number.trim()) {
      newErrors.citizenship_number =
        "Citizenship number is required";
    }
  
    if (!form.citizenship_issued_district) {
      newErrors.citizenship_issued_district =
        "Issued district is required";
    }
  
    if (!form.citizenship_issued_date) {
      newErrors.citizenship_issued_date =
        "Issued date is required";
    }
  
    if (
      !/^(\+977)?9\d{9}$/.test(form.phone_number)
    ) {
      newErrors.phone_number =
        "Enter a valid Nepali mobile number";
    }
  
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = "Enter a valid email";
    }
  
    if (!form.province) {
      newErrors.province = "Province is required";
    }
  
    if (!form.district) {
      newErrors.district = "District is required";
    }
  
    if (!form.municipality.trim()) {
      newErrors.municipality =
        "Municipality is required";
    }
  
    if (!form.ward_number.trim()) {
      newErrors.ward_number = "Ward number is required";
    }
  
    if (!form.permanent_address.trim()) {
      newErrors.permanent_address =
        "Permanent address is required";
    }
  
    if (!form.occupation) {
      newErrors.occupation = "Occupation is required";
    }
  
    if (!form.source_of_funds) {
      newErrors.source_of_funds =
        "Source of funds is required";
    }
  
    if (
      form.pan_number &&
      !/^\d{9}$/.test(form.pan_number)
    ) {
      newErrors.pan_number = "PAN must be 9 digits";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the highlighted fields");
      return;
    }
  
    if (
      !files.citizenship_front ||
      !files.citizenship_back
    ) {
      toast.error(
        "Please upload citizenship (front & back)"
      );
      return;
    }
  
    setSubmitting(true);
  
    try {
      await createKyc({
        full_name: form.full_name,
        date_of_birth: form.date_of_birth,
        gender: form.gender,
  
        citizenship_number: form.citizenship_number,
        citizenship_issued_district:
          form.citizenship_issued_district,
        citizenship_issued_date:
          form.citizenship_issued_date,
  
        pan_number: form.pan_number || null,
  
        phone_number: form.phone_number,
        email: form.email,
  
        province: form.province,
        district: form.district,
        municipality: form.municipality,
        ward_number: form.ward_number,
  
        tole: form.tole || null,
  
        permanent_address: form.permanent_address,
        temporary_address:
          form.temporary_address || null,
  
        occupation: form.occupation,
        source_of_funds: form.source_of_funds,
  
        citizenship_front: files.citizenship_front,
        citizenship_back: files.citizenship_back,
        pan_document: files.pan_document || null,
      });
  
      toast.success(
        "KYC submitted. We'll review within 1-2 business days."
      );
  
      setExisting({
        status: "pending",
        rejection_reason: null,
      });
    } catch (err: any) {
      const msg = err?.errors
        ? Object.values(err.errors).join(", ")
        : err?.message ?? "Submission failed";
  
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (existing && existing.status !== "rejected") {
    const isApproved = existing.status === "approved";
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="border-border/60">
            <CardHeader className="text-center">
              {isApproved ? (
                <CheckCircle2 className="h-14 w-14 text-green-600 mx-auto mb-3" />
              ) : (
                <Clock className="h-14 w-14 text-amber-500 mx-auto mb-3" />
              )}
              <CardTitle className="font-display text-2xl">
                {isApproved ? "KYC Verified" : "KYC Under Review"}
              </CardTitle>
              <CardDescription>
                {isApproved
                  ? "Your identity has been verified. You now have full access to donate and create campaigns."
                  : "Your submission is being reviewed by our compliance team. This usually takes 1-2 business days."}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Badge variant={isApproved ? "default" : "secondary"} className="text-sm">
                Status: {existing.status}
              </Badge>
              <div className="mt-6">
                <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const districts = form.province ? NEPAL_PROVINCES[form.province] || [] : [];

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="font-display text-3xl font-bold">KYC Verification</h1>
          </div>
          {/* <p className="text-muted-foreground mb-6">
            Required by Nepal Rastra Bank guidelines (AML/CFT Act 2008). Your data is encrypted and only accessed by our compliance team.
          </p> */}

          {existing?.status === "rejected" && (
            <Card className="mb-6 border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6 flex gap-3">
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Previous submission rejected</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {existing.rejection_reason || "Please review your details and resubmit."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
                <CardDescription>As shown on your Nepali citizenship certificate (नागरिकता).</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name (as on citizenship)" error={errors.full_name}>
                  <Input value={form.full_name} onChange={(e) => set("full_name", e.target.value)} maxLength={120} />
                </Field>
                <Field label="Date of Birth (A.D.)" error={errors.date_of_birth}>
                  <Input type="date" value={form.date_of_birth} onChange={(e) => set("date_of_birth", e.target.value)} />
                </Field>
                <Field label="Gender" error={errors.gender}>
                  <Select value={form.gender} onValueChange={(v) => set("gender", v as FormState["gender"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Mobile Number" error={errors.phone_number}>
                  <Input placeholder="98XXXXXXXX" value={form.phone_number} onChange={(e) => set("phone_number", e.target.value)} />
                </Field>
                <Field label="Email" error={errors.email}>
                  <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                </Field>
                <Field label="Occupation" error={errors.occupation}>
                  <Select value={form.occupation} onValueChange={(v) => set("occupation", v)}>
                    <SelectTrigger><SelectValue placeholder="Select occupation" /></SelectTrigger>
                    <SelectContent>
                      {OCCUPATIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </CardContent>
            </Card>

            {/* Identity Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Identity Documents</CardTitle>
                <CardDescription>Citizenship is mandatory. PAN is optional unless you donate above NPR 5,00,000/year.</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <Field label="Citizenship Number (नागरिकता नं.)" error={errors.citizenship_number}>
                  <Input placeholder="e.g. 12-34-567-89012" value={form.citizenship_number} onChange={(e) => set("citizenship_number", e.target.value)} />
                </Field>
                <Field label="Issued District" error={errors.citizenship_issued_district}>
                  <Select value={form.citizenship_issued_district} onValueChange={(v) => set("citizenship_issued_district", v)}>
                    <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                    <SelectContent className="max-h-72">
                      {Object.values(NEPAL_PROVINCES).flat().sort().map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Issued Date (A.D.)" error={errors.citizenship_issued_date}>
                  <Input type="date" value={form.citizenship_issued_date} onChange={(e) => set("citizenship_issued_date", e.target.value)} />
                </Field>
                <Field label="PAN Number (optional, 9 digits)" error={errors.pan_number}>
                  <Input placeholder="123456789" value={form.pan_number} onChange={(e) => set("pan_number", e.target.value)} maxLength={9} />
                </Field>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Address</CardTitle>
                <CardDescription>Permanent address as per citizenship certificate.</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <Field label="Province" error={errors.province}>
                  <Select value={form.province} onValueChange={(v) => { set("province", v); set("district", ""); }}>
                    <SelectTrigger><SelectValue placeholder="Select province" /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(NEPAL_PROVINCES).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="District" error={errors.district}>
                  <Select value={form.district} onValueChange={(v) => set("district", v)} disabled={!form.province}>
                    <SelectTrigger><SelectValue placeholder={form.province ? "Select district" : "Select province first"} /></SelectTrigger>
                    <SelectContent className="max-h-72">
                      {districts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Municipality / Rural Municipality" error={errors.municipality}>
                  <Input placeholder="e.g. Kathmandu Metropolitan City" value={form.municipality} onChange={(e) => set("municipality", e.target.value)} />
                </Field>
                <Field label="Ward No." error={errors.ward_number}>
                  <Input placeholder="e.g. 10" value={form.ward_number} onChange={(e) => set("ward_number", e.target.value)} maxLength={2} />
                </Field>
                <Field label="Tole / Street (optional)" error={errors.tole}>
                  <Input value={form.tole} onChange={(e) => set("tole", e.target.value)} maxLength={100} />
                </Field>
                <Field label="Source of Funds" error={errors.source_of_funds}>
                  <Select value={form.source_of_funds} onValueChange={(v) => set("source_of_funds", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {SOURCE_OF_FUNDS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Permanent Address (full)" error={errors.permanent_address} className="sm:col-span-2">
                  <Textarea value={form.permanent_address} onChange={(e) => set("permanent_address", e.target.value)} maxLength={300} rows={2} />
                </Field>
                <Field label="Temporary Address (optional)" error={errors.temporary_address} className="sm:col-span-2">
                  <Textarea value={form.temporary_address} onChange={(e) => set("temporary_address", e.target.value)} maxLength={300} rows={2} />
                </Field>
              </CardContent>
            </Card>

            {/* Uploads */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Uploads</CardTitle>
                <CardDescription>Clear photos (JPG/PNG, max 5MB each). Files are stored privately.</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <FileField label="Citizenship — Front" file={files.citizenship_front}
                  onChange={(f) => setFiles((s) => ({ ...s, citizenship_front: f }))} />
                <FileField label="Citizenship — Back" file={files.citizenship_back}
                  onChange={(f) => setFiles((s) => ({ ...s, citizenship_back: f }))} />
                <FileField label="PAN Card (optional)" file={files.pan_document}
                  onChange={(f) => setFiles((s) => ({ ...s, pan_document: f }))} />
              </CardContent>
            </Card>

            <Separator />

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-muted-foreground max-w-xl">
                By submitting, you confirm the information is accurate and consent to Nepal Hands processing
                this data for identity verification under Nepal's Privacy Act 2018.
              </p>
              <Button type="submit" size="lg" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Submit for Verification
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const Field = ({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) => (
  <div className={"space-y-2 " + (className || "")}>
    <Label>{label}</Label>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

const FileField = ({ label, file, onChange }: { label: string; file: File | null; onChange: (f: File | null) => void }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <label className="flex items-center gap-3 border border-dashed border-border rounded-md px-4 py-3 cursor-pointer hover:bg-accent/40 transition">
      <Upload className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm truncate flex-1">
        {file ? file.name : "Click to upload (JPG/PNG)"}
      </span>
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          if (f && f.size > 5 * 1024 * 1024) { toast.error("Max 5MB per file"); return; }
          onChange(f);
        }}
      />
    </label>
  </div>
);

export default Kyc;