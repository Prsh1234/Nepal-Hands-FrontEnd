import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, Check, Upload, X,
  Droplets, GraduationCap, Heart, Home, Leaf, Users,
  Image as ImageIcon,
  ListChecks,
  Shield,
  Calendar,
} from "lucide-react";
import { createCampaign } from "@/services/campaignService";

const CATEGORIES = [
  { id: "water", label: "Water & Sanitation", icon: Droplets },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "health", label: "Health", icon: Heart },
  { id: "shelter", label: "Shelter & Housing", icon: Home },
  { id: "environment", label: "Environment", icon: Leaf },
  { id: "empowerment", label: "Empowerment", icon: Users },
];

const STEPS = ["Basics", "Story", "Goal", "Media", "Schedule", "Review"];

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setdescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [projectScope, setProjectScope] = useState("");
  const [goal, setGoal] = useState<number>(0);
  const [duration, setDuration] = useState("30");
  const [organizer, setOrganizer] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  // Step 3: Schedule
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const progress = ((step + 1) / STEPS.length) * 100;

  const canProceed = () => {
    switch (step) {
      case 0:
        return title.trim() && category && location.trim();
      case 1:
        return description.trim() && longDescription.trim().length >= 50 && projectScope.trim().length > 0;
      case 2:
        return Number(goal) >= 1000 && organizer.trim();
      case 3:
        return true; // images optional
      case 4:
        return startDate && endDate && contactName.trim() && contactEmail.trim();
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files) return;

    const remainingSlots = 5 - images.length;

    const selectedFiles = Array.from(files).slice(0, remainingSlots);

    // preview URLs
    const imageUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImages((prev) => [...prev, ...imageUrls]);

    // actual files for backend
    setImageFiles((prev) => [...prev, ...selectedFiles]);

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };


  const handleSubmit = async () => {
    try {
      const coverImageFile = imageFiles[0] || null;
      const galleryImages = imageFiles.slice(1);
      await createCampaign({
        title,
        category,
        location,
        description,
        longDescription,
        projectScope,
        goal,
        duration,
        organizer,
        startDate,
        endDate,
        contactName,
        contactEmail,
        contactPhone: contactPhone || null,
        coverImage: coverImageFile,   // File
        images: galleryImages,        // File[]
      });
      toast.success("Volunteer request submitted! We'll review it within 24 hours.");
      navigate("/");
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
              onClick={() => step > 0 ? setStep(step - 1) : navigate("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> {step > 0 ? "Previous Step" : "Back"}
            </button>
            <h1 className="font-playfair text-3xl font-bold text-foreground">
              Start a Campaign
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
              {/* Step 0: Basics */}
              {step === 0 && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Campaign Title *</label>
                    <Input
                      placeholder="e.g. Clean Water for Dolakha"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={80}
                    />
                    <p className="text-xs text-muted-foreground">{title.length}/80 characters</p>
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
                      placeholder="e.g. Dolakha, Bagmati Province"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Step 1: Story */}
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Short Description *</label>
                    <Textarea
                      placeholder="Briefly describe your campaign in 1-2 sentences..."
                      value={description}
                      onChange={(e) => setdescription(e.target.value)}
                      maxLength={200}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">{description.length}/200 characters</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Long Description*</label>
                    <Textarea
                      placeholder="Tell your story in detail. Explain the problem, your solution, and how the funds will be used..."
                      value={longDescription}
                      onChange={(e) => setLongDescription(e.target.value)}
                      rows={10}
                      className="min-h-[200px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      {longDescription.length} characters (minimum 50)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Project Scope *</label>
                    <p className="text-xs text-muted-foreground">
                      One scope per line. These appear as a checklist on the donation page.
                    </p>
                    <Textarea
                      placeholder={"Rebuild 3 primary schools with earthquake-resistant design\nFurnish classrooms with modern learning materials"}
                      value={projectScope}
                      onChange={(e) => setProjectScope(e.target.value)}
                      rows={6}
                      className="min-h-[140px]"
                    />
                  </div>
                </>
              )}

              {/* Step 2: Goal */}
              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Organization / Creator Name *</label>
                    <Input
                      placeholder="e.g. Nepal Water Foundation"
                      value={organizer}
                      onChange={(e) => setOrganizer(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Fundraising Goal (NPR) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                        NPR
                      </span>
                      <Input
                        type="number"
                        placeholder="500000"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value === "" ? 0 : Number(e.target.value))}
                        className="pl-12"
                        min={1000}
                      />
                    </div>
                    {goal && Number(goal) >= 1000 && (
                      <p className="text-xs text-muted-foreground">
                        Goal: NPR {Number(goal).toLocaleString("en-IN")}
                      </p>
                    )}
                    {goal && Number(goal) < 1000 && (
                      <p className="text-xs text-destructive">Minimum goal is NPR 1,000</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Campaign Duration</label>
                    <div className="flex gap-3">
                      {["15", "30", "45", "60"].map((d) => (
                        <button
                          key={d}
                          onClick={() => setDuration(d)}
                          className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${duration === d
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/40 text-foreground"
                            }`}
                        >
                          {d} days
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Media */}
              {step === 3 && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Campaign Images</label>
                    <p className="text-xs text-muted-foreground">
                      Upload up to 5 images. The first image will be used as the cover.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((img, i) => (
                      <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-border group">
                        <img src={img} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}

                    {images.length < 5 && (
                      <label className="aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                        <Upload className="w-6 h-6" />
                        <span className="text-xs font-medium">Add Image</span>

                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                </>
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
                <div className="space-y-6">
                  <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                    <h3 className="font-playfair text-xl font-bold text-foreground">{title}</h3>

                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs font-semibold bg-accent text-accent-foreground px-3 py-1 rounded-full">
                        {CATEGORIES.find((c) => c.id === category)?.label}
                      </span>
                      <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        📍 {location}
                      </span>
                      <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        ⏱ {duration} days
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">{description}</p>
                    <p className="text-sm text-muted-foreground">{longDescription}</p>

                    <div className="border-t border-border pt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Goal</p>
                        <p className="font-semibold text-primary">
                          NPR {Number(goal).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Dates
                        </p>
                        <p className="font-semibold text-foreground">
                          {startDate} — {endDate}
                        </p>
                      </div>
                    </div>

                    {(projectScope.trim()) && (
                      <div className="border-t border-border pt-4 space-y-4">
                        {projectScope.trim() && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                              <ListChecks className="w-3 h-3" /> Project Scope
                            </p>
                            <ul className="space-y-1 text-sm text-foreground list-disc pl-5">
                              {projectScope.split("\n").filter((l) => l.trim()).map((l, i) => (
                                <li key={i}>{l.trim()}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="border-t border-border pt-4 grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Organization</p>
                        <p className="font-semibold text-foreground">{organizer}</p>
                      </div>
                    </div>


                    {images.length > 0 && (
                      <div className="flex gap-2 pt-2">
                        {images.map((img, i) => (
                          <div key={i} className="w-16 h-12 rounded-lg overflow-hidden border border-border">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        <span className="text-xs text-muted-foreground self-center ml-1">
                          {images.length} image{images.length > 1 ? "s" : ""}
                        </span>
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
                  </div>



                  <div className="rounded-2xl border border-border bg-accent/30 p-4 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground mb-1">Before you publish</p>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>Your campaign will be reviewed within 24 hours</li>
                      <li>You can edit details after submission</li>
                      <li>Verified organizations get a trust badge</li>
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
                <Check className="w-4 h-4 mr-1" /> Submit Campaign
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateCampaign;
