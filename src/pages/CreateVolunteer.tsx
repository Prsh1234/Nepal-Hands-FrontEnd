import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowLeft, ArrowRight, Check, Calendar, MapPin, Users,
  GraduationCap, Heart, Droplets, Home, Leaf, Tag, Clock,
  Briefcase, Languages, Shield, ListChecks, Sparkles, Star,
  Upload,
  X,
  ImageIcon,
  LinkIcon,
  BadgeCheck,
  FileCheck,
} from "lucide-react";
import { createVolunteerOpportunity } from "@/services/volunteerService";
import { toast } from "sonner";
const CATEGORIES = [
  { id: "TEACHING", label: "Teaching", icon: GraduationCap },
  { id: "HEALTHCARE", label: "Healthcare", icon: Heart },
  { id: "CONSTRUCTION", label: "Construction", icon: Home },
  { id: "ENVIRONMENT", label: "Environment", icon: Leaf },
  { id: "WATER", label: "Water & Sanitation", icon: Droplets },
  { id: "COMMUNITY", label: "Community Work", icon: Users },
];

const SKILL_OPTIONS = [
  "Teaching", "First Aid", "Medical", "Construction", "Engineering",
  "IT & Digital", "Photography", "Translation", "Cooking", "Driving",
  "Project Management", "Social Work", "Counseling", "Agriculture",
];

const COMMITMENT_OPTIONS = [
  { id: "one-time", label: "One-time Event" },
  { id: "short-term", label: "Short-term (1–2 weeks)" },
  { id: "medium-term", label: "Medium-term (1–3 months)" },
  { id: "long-term", label: "Long-term (3+ months)" },
];
const ORG_TYPES = [
  { id: "ngo", label: "NGO" },
  { id: "ingo", label: "INGO" },
  { id: "cso", label: "Community-Based Org" },
  { id: "company", label: "Pvt. Ltd / Company" },
  { id: "cooperative", label: "Cooperative" },
  { id: "individual", label: "Individual / Group" },
];
const DOCUMENT_TYPES = [
  {
    id: "Registration Certificate",
    label: "Registration Certificate",
    required: true,
    hint: "Issued by DAO / Company Registrar / Cooperative Dept.",
  },

  {
    id: "SWC Affiliation Certificate",
    label: "SWC Affiliation Certificate",
    required: false,
    conditional: ["ngo", "ingo"],
    hint: "Required for NGOs/INGOs working with foreign aid.",
  },

  {
    id: "Citizenship / National ID",
    label: "Citizenship / National ID",
    required: false,
    conditional: ["individual"],
    hint: "Required for individuals or informal groups.",
  },

  {
    id: "PAN / VAT Certificate",
    label: "PAN / VAT Certificate",
    required: true,
    hint: "Issued by Inland Revenue Department.",
  },

  {
    id: "Tax Clearance Certificate",
    label: "Tax Clearance Certificate",
    required: false,
    hint: "Most recent fiscal year.",
  },

  {
    id: "Constitution / MoA & AoA",
    label: "Constitution / MoA & AoA",
    required: false,
    hint: "Governing document of the organization.",
  },

  {
    id: "Local Body Permission Letter",
    label: "Local Body Permission Letter",
    required: false,
    hint: "From Municipality / Ward where activity occurs.",
  },
];
const STEPS = ["Details", "Requirements", "Activities & Impact", "Media", "Schedule", "Verification", "Review"];

const CreateVolunteer = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Step 0: Details
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [organizer, setOrganizer] = useState("");

  // Step 1: Requirements
  const [skills, setSkills] = useState<string[]>([]);
  const [spots, setSpots] = useState("10");
  const [ageMin, setAgeMin] = useState("18");
  const [commitmentType, setCommitmentType] = useState("short-term");
  const [requirements, setRequirements] = useState("");

  // Step 2: Activities & Impact
  const [activities, setActivities] = useState("");
  const [whyItMatters, setWhyItMatters] = useState("");
  const [benefits, setBenefits] = useState("");

  // Step 3: Schedule
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dailyHours, setDailyHours] = useState("6");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Step 4: Image
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);

  // Step 5: Verification

  const [orgLegalName, setOrgLegalName] = useState("");
  const [orgType, setOrgType] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [regAuthority, setRegAuthority] = useState("");
  const [regDate, setRegDate] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [authorizedSignatory, setAuthorizedSignatory] = useState("");
  const [signatoryRole, setSignatoryRole] = useState("");

  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [orgAddress, setOrgAddress] = useState("");
  const [officialPhone, setOfficialPhone] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");

  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File | null>>(
    {}
  );
  const handleDocumentUpload = (
    docId: string,
    file: File | null
  ) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [docId]: file,
    }));
  };

  const removeDocument = (docId: string) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [docId]: null,
    }));
  };

  const progress = ((step + 1) / STEPS.length) * 100;
  const handleCoverUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setCoverImage(URL.createObjectURL(file));
    setCoverImageFile(file);

    e.target.value = "";
  };

  const handleGalleryUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files) return;

    const remainingSlots = 4 - galleryImages.length;

    const selectedFiles = Array.from(files).slice(0, remainingSlots);

    const imageUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setGalleryImages((prev) => [...prev, ...imageUrls]);
    setGalleryImageFiles((prev) => [...prev, ...selectedFiles]);

    e.target.value = "";
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverImageFile(null);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
    setGalleryImageFiles(galleryImageFiles.filter((_, i) => i !== index));
  };

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return title.trim() && category && location.trim() && description.trim().length >= 20 && longDescription.trim().length >= 40 && organizer.trim();
      case 1:
        return skills.length > 0 && Number(spots) >= 1 && requirements.trim().length > 0;
      case 2:
        return activities.trim().length > 0 && whyItMatters.trim().length >= 20 && benefits.trim().length > 0;
      case 3:
        return !!coverImageFile;
      case 4:
        return startDate && endDate && contactName.trim() && contactEmail.trim();
      case 5: {
        const requiredDocsUploaded = DOCUMENT_TYPES.every((doc) => {
          const isConditionallyRequired =
            doc.conditional?.includes(orgType);

          const isRequired =
            doc.required || isConditionallyRequired;

          return !isRequired || uploadedDocs[doc.id];
        });

        return (
          orgLegalName.trim() &&
          orgType &&
          orgAddress.trim() &&
          regNumber.trim() &&
          regAuthority.trim() &&
          panNumber.trim() &&
          officialPhone.trim() &&
          officialEmail.trim() &&
          authorizedSignatory.trim() &&
          signatoryRole.trim() &&
          requiredDocsUploaded &&
          declarationAccepted
        );
      }
      case 6:
        return true;
      default:
        return false;
    }
  };



  const handleSubmit = async () => {
    try {
      const response = await createVolunteerOpportunity({
        title,
        category,
        location,
        description,
        longDescription,
        organizer,
        requiredSkills: skills,
        volunteerSpots: Number(spots),
        minimumAge: Number(ageMin),
        commitmentType,
        requirements,
        activities,
        whyItMatters,
        benefits,
        startDate,
        endDate,
        dailyHours: Number(dailyHours),
        coverImage: coverImageFile,
        images: galleryImageFiles,
        contactName,
        contactEmail,
        contactPhone: contactPhone || null,

        orgLegalName,
        orgType,
        orgAddress,
        regNumber,
        regAuthority,
        regDate,
        panNumber,
        website,
        officialEmail,
        officialPhone,
        authorizedSignatory,
        signatoryRole,
        uploadedDocs,
      });
      toast.success("Volunteer request submitted! We'll review it within 24 hours.");
      navigate(`/volunteer/${response.id}`);
    } catch (err: any) {
      const msg = err?.errors
        ? Object.values(err.errors).join(", ")   // Spring field-level errors
        : err?.message ?? "Something went wrong";
      toast.error(msg);
    }
  };

  const stepVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => (step > 0 ? setStep(step - 1) : navigate(-1))}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> {step > 0 ? "Previous Step" : "Back"}
            </button>
            <h1 className="font-playfair text-3xl font-bold text-foreground">
              Create Volunteer Request
            </h1>
            <p className="text-muted-foreground mt-1">
              Step {step + 1} of {STEPS.length} — {STEPS[step]}
            </p>
          </div>

          {/* Progress */}
          <Progress value={progress} className="h-2 mb-8" />

          {/* Step indicators */}
          <div className="flex justify-between mb-10">
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => i < step && setStep(i)}
                className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${i <= step ? "text-primary" : "text-muted-foreground"
                  } ${i < step ? "cursor-pointer" : "cursor-default"}`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                      ? "bg-primary/10 text-primary border-2 border-primary"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </span>
                <span className="hidden sm:block">{s}</span>
              </button>
            ))}
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Step 0: Details */}
              {step === 0 && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Opportunity Title *
                    </label>
                    <Input
                      placeholder="e.g. Teaching English in Rural Schools"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                    />
                    <p className="text-xs text-muted-foreground">{title.length}/100 characters</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Category *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${category === cat.id
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/40 text-foreground"
                              }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Location *</label>
                    <Input
                      placeholder="e.g. Gorkha District, Gandaki Province"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Description *</label>
                    <Textarea
                      placeholder="Describe the volunteer opportunity, what volunteers will do, and its impact..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      {description.length} characters (minimum 20)
                    </p>
                  </div>


                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Full Description *</label>
                    <Textarea
                      placeholder="Describe the volunteer opportunity, what volunteers will do, and its impact..."
                      value={longDescription}
                      onChange={(e) => setLongDescription(e.target.value)}
                      rows={5}
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      {longDescription.length} characters (minimum 40)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Organizer *</label>
                    <Textarea
                      placeholder="Who organized the volunteer opportunity?"
                      value={organizer}
                      onChange={(e) => setOrganizer(e.target.value)}
                      rows={5}
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      {organizer.length} characters (minimum 40)
                    </p>
                  </div>
                </>
              )}

              {/* Step 1: Requirements */}
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Required Skills *
                    </label>
                    <p className="text-xs text-muted-foreground">Select all that apply</p>
                    <div className="flex flex-wrap gap-2">
                      {SKILL_OPTIONS.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${skills.includes(skill)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/40 text-foreground"
                            }`}
                        >
                          <Tag className="w-3 h-3" />
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Volunteer Spots *
                      </label>
                      <Input
                        type="number"
                        value={spots}
                        onChange={(e) => setSpots(e.target.value)}
                        min={1}
                        max={500}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Minimum Age
                      </label>
                      <Input
                        type="number"
                        value={ageMin}
                        onChange={(e) => setAgeMin(e.target.value)}
                        min={16}
                        max={65}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Commitment Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {COMMITMENT_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setCommitmentType(opt.id)}
                          className={`p-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${commitmentType === opt.id
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/40 text-foreground"
                            }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Eligibility and Requirements
                    </label>
                    <Textarea
                      placeholder="e.g. Must be comfortable in remote areas, bring own sleeping bag..."
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      rows={3}
                    />
                  </div>
                </>
              )}

              {/* Step 2: Activities & Impact */}
              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-primary" />
                      What Volunteers Will Do *
                    </label>
                    <p className="text-xs text-muted-foreground">
                      One activity per line. These appear as a checklist on the opportunity page.
                    </p>
                    <Textarea
                      placeholder={"Conduct daily English language classes for groups of 15-20 children\nIntroduce basic computer literacy using donated laptops\nOrganize creative learning activities and cultural exchange sessions"}
                      value={activities}
                      onChange={(e) => setActivities(e.target.value)}
                      rows={6}
                      className="min-h-[140px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Why This Matters *
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Explain the impact and meaning of this work for the community.
                    </p>
                    <Textarea
                      placeholder="English literacy opens doors to higher education and employment opportunities for these children..."
                      value={whyItMatters}
                      onChange={(e) => setWhyItMatters(e.target.value)}
                      rows={5}
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      {whyItMatters.length} characters (minimum 20)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Star className="w-4 h-4 text-primary" />
                      What Volunteers Get *
                    </label>
                    <p className="text-xs text-muted-foreground">
                      One benefit per line (accommodation, meals, certificate, etc.).
                    </p>
                    <Textarea
                      placeholder={"Free accommodation in community homestays\nTwo meals per day provided\nLocal transportation covered\nCertificate of volunteer service"}
                      value={benefits}
                      onChange={(e) => setBenefits(e.target.value)}
                      rows={6}
                      className="min-h-[140px]"
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <div className="space-y-8">

                  {/* Cover Image */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-foreground">
                        Cover Image *
                      </label>
                      <p className="text-xs text-muted-foreground">
                        This image appears on the campaign card and hero section.
                      </p>
                    </div>

                    {coverImage ? (
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-border group">
                        <img
                          src={coverImage}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />

                        <button
                          onClick={removeCoverImage}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-primary text-primary-foreground px-2 py-1 rounded-full">
                          Cover
                        </span>
                      </div>
                    ) : (
                      <label className="aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-sm font-medium">
                          Upload Cover Image
                        </span>

                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={handleCoverUpload}
                        />
                      </label>
                    )}
                  </div>

                  {/* Gallery Images */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-foreground">
                        Gallery Images
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Upload up to 4 additional images.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {galleryImages.map((img, i) => (
                        <div
                          key={i}
                          className="relative aspect-video rounded-xl overflow-hidden border border-border group"
                        >
                          <img
                            src={img}
                            alt={`Gallery ${i + 1}`}
                            className="w-full h-full object-cover"
                          />

                          <button
                            onClick={() => removeGalleryImage(i)}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {galleryImages.length < 4 && (
                        <label className="aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                          <Upload className="w-6 h-6" />
                          <span className="text-xs font-medium">
                            Add Images
                          </span>

                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            onChange={handleGalleryUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* Step 4: Schedule & Contact */}
              {step === 4 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Start Date *
                      </label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        End Date *
                      </label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Daily Hours Expected
                    </label>
                    <div className="flex gap-3">
                      {["4", "6", "8"].map((h) => (
                        <button
                          key={h}
                          onClick={() => setDailyHours(h)}
                          className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${dailyHours === h
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/40 text-foreground"
                            }`}
                        >
                          {h} hrs/day
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border pt-6 space-y-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Contact Information
                    </h3>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Contact Person *
                      </label>
                      <Input
                        placeholder="Full name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                          Email *
                        </label>
                        <Input
                          type="email"
                          placeholder="contact@org.np"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                          Phone (optional)
                        </label>
                        <Input
                          type="tel"
                          placeholder="+977-XXXXXXXXXX"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}


              {/* Step 5: Review */}
              {step === 5 && (
                <>
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex gap-3">
                    <BadgeCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-foreground mb-1">
                        Proof of Authenticity
                      </p>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        To protect volunteers and build trust, Nepal Hands verifies every
                        organization. Provide your legal registration details and supporting
                        documents as required by the Social Welfare Council and local laws.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Organization Legal Name *
                    </label>
                    <Input
                      placeholder="As registered with the authority"
                      value={orgLegalName}
                      onChange={(e) => setOrgLegalName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Organization Type *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {ORG_TYPES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setOrgType(t.id)}
                          className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${orgType === t.id
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/40 text-foreground"
                            }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Registration Number *
                      </label>
                      <Input
                        placeholder="e.g. 1234/078/079"
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Registration Date
                      </label>
                      <Input
                        type="date"
                        value={regDate}
                        onChange={(e) => setRegDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Registering Authority *
                    </label>
                    <Input
                      placeholder="e.g. District Admin Office, Kathmandu / Company Registrar / SWC"
                      value={regAuthority}
                      onChange={(e) => setRegAuthority(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        PAN / VAT Number *
                      </label>
                      <Input
                        placeholder="9-digit PAN"
                        value={panNumber}
                        onChange={(e) => setPanNumber(e.target.value)}
                        maxLength={9}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Website / Social Page
                      </label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="https://"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Organization Address *
                    </label>

                    <Textarea
                      placeholder="Ward, Municipality, District, Province"
                      value={orgAddress}
                      onChange={(e) => setOrgAddress(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Official Email *
                      </label>

                      <Input
                        type="email"
                        placeholder="office@organization.org"
                        value={officialEmail}
                        onChange={(e) => setOfficialEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Official Contact Number *
                      </label>

                      <Input
                        type="tel"
                        placeholder="+977-XXXXXXXXXX"
                        value={officialPhone}
                        onChange={(e) => setOfficialPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Authorized Signatory *
                      </label>
                      <Input
                        placeholder="Full name"
                        value={authorizedSignatory}
                        onChange={(e) => setAuthorizedSignatory(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Designation *
                      </label>
                      <Input
                        placeholder="e.g. Executive Director"
                        value={signatoryRole}
                        onChange={(e) => setSignatoryRole(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-primary" />
                      Supporting Documents
                    </label>
                    <p className="text-xs text-muted-foreground">
                      PDF, JPG or PNG up to 10MB each. Required documents are marked.
                    </p>
                    <div className="space-y-2">
                      {DOCUMENT_TYPES
                        .filter((doc) => {
                          if (!doc.conditional) return true;

                          return doc.conditional.includes(orgType);
                        })
                        .map((doc) => {
                          const uploaded = Boolean(uploadedDocs[doc.id]);
                          return (
                            <div
                              key={doc.id}
                              className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all ${uploaded
                                ? "border-primary/50 bg-primary/5"
                                : "border-border"
                                }`}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-medium text-foreground">
                                    {doc.label}
                                  </span>
                                  {doc.required || doc.conditional?.includes(orgType) ? (
                                    <span className="text-[10px] font-semibold bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                                      Required
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                                      Optional
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {doc.hint}
                                </p>
                                {uploaded && (
                                  <p className="text-xs text-primary mt-1 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> {uploadedDocs[doc.id]?.name}
                                  </p>
                                )}
                              </div>
                              <div className="shrink-0">
                                {uploaded ? (
                                  <button
                                    type="button"
                                    onClick={() => removeDocument(doc.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
                                  >
                                    <X className="w-3 h-3" />
                                    Remove
                                  </button>
                                ) : (
                                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer">
                                    <Upload className="w-3 h-3" />
                                    Upload

                                    <input
                                      type="file"
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      hidden
                                      onChange={(e) =>
                                        handleDocumentUpload(
                                          doc.id,
                                          e.target.files?.[0] || null
                                        )
                                      }
                                    />
                                  </label>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <label className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/30 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={declarationAccepted}
                      onChange={(e) => setDeclarationAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-primary"
                    />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      I declare that the information and documents submitted are true,
                      authentic, and legally valid. I understand that submitting forged
                      documents may result in permanent suspension and legal action under
                      the laws of Nepal.
                    </span>
                  </label>
                </>
              )}




              {/* Step 5: Review */}
              {step === 6 && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                    <h3 className="font-playfair text-xl font-bold text-foreground">
                      {title}
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs font-semibold bg-accent text-accent-foreground px-3 py-1 rounded-full">
                        {CATEGORIES.find((c) => c.id === category)?.label}
                      </span>
                      <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {location}
                      </span>
                      <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full flex items-center gap-1">
                        <Users className="w-3 h-3" /> {spots} spots
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">{description}</p>
                    <p className="text-sm text-muted-foreground">{longDescription}</p>
                    <p className="text-sm text-muted-foreground">{organizer}</p>




                    <div className="border-t border-border pt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Dates
                          </p>
                          <p className="font-semibold text-foreground">
                            {startDate} — {endDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Daily Hours
                          </p>
                          <p className="font-semibold text-foreground">{dailyHours} hrs/day</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                          <Briefcase className="w-3 h-3" /> Commitment
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {COMMITMENT_OPTIONS.find((o) => o.id === commitmentType)?.label}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Required Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {skills.map((s) => (
                            <span
                              key={s}
                              className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {(activities.trim() || whyItMatters.trim() || benefits.trim() || requirements.trim()) && (
                      <div className="border-t border-border pt-4 space-y-4">
                        {activities.trim() && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                              <ListChecks className="w-3 h-3" /> What volunteers will do
                            </p>
                            <ul className="space-y-1 text-sm text-foreground list-disc pl-5">
                              {activities.split("\n").filter((l) => l.trim()).map((l, i) => (
                                <li key={i}>{l.trim()}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {whyItMatters.trim() && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Why this matters
                            </p>
                            <p className="text-sm text-foreground whitespace-pre-line">{whyItMatters}</p>
                          </div>
                        )}
                        {benefits.trim() && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                              <Star className="w-3 h-3" /> What volunteers get
                            </p>
                            <ul className="space-y-1 text-sm text-foreground list-disc pl-5">
                              {benefits.split("\n").filter((l) => l.trim()).map((l, i) => (
                                <li key={i}>{l.trim()}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {requirements.trim() && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                              <Star className="w-3 h-3" /> Requirements
                            </p>
                            <ul className="space-y-1 text-sm text-foreground list-disc pl-5">
                              {requirements.split("\n").filter((l) => l.trim()).map((l, i) => (
                                <li key={i}>{l.trim()}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="border-t border-border pt-4 text-sm">
                      <p className="text-muted-foreground mb-1 flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Contact
                      </p>
                      <p className="font-semibold text-foreground">{contactName}</p>
                      <p className="text-muted-foreground">
                        {contactEmail}
                        {contactPhone && ` • ${contactPhone}`}
                      </p>
                    </div>

                    <div className="border-t border-border pt-4 text-sm space-y-2">
                      <p className="text-muted-foreground flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" /> Verification
                      </p>
                      <p className="font-semibold text-foreground">{orgLegalName}</p>
                      <p className="text-xs text-muted-foreground">
                        {ORG_TYPES.find((t) => t.id === orgType)?.label} • Reg.
                        {" "}{regNumber} • {regAuthority}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PAN: {panNumber}
                        {website && ` • ${website}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Signatory: {authorizedSignatory} ({signatoryRole})
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {Object.entries(uploadedDocs)
                          .filter(([_, file]) => file)
                          .map(([id]) => {
                            const doc = DOCUMENT_TYPES.find((d) => d.id === id);
                            if (!doc) return null;
                            return (
                              <span
                                key={id}
                                className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1"
                              >
                                <FileCheck className="w-3 h-3" /> {doc.label}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-accent/30 p-4 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground mb-1">Before you publish</p>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>Your request will be reviewed within 24 hours</li>
                      <li>Verified organizations get priority listing</li>
                      <li>Volunteers will be matched based on skills</li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => (step > 0 ? setStep(step - 1) : navigate(-1))}
              className="rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {step > 0 ? "Back" : "Cancel"}
            </Button>

            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="rounded-xl bg-primary hover:bg-primary/90"
              >
                Continue <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="rounded-xl bg-secondary hover:bg-secondary/90"
              >
                <Check className="w-4 h-4 mr-1" /> Submit Request
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateVolunteer;
