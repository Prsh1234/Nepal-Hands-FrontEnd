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
  Briefcase, Languages, Shield,
} from "lucide-react";
import { campaigns } from "@/data/campaigns";

const CATEGORIES = [
  { id: "teaching", label: "Teaching", icon: GraduationCap },
  { id: "healthcare", label: "Healthcare", icon: Heart },
  { id: "construction", label: "Construction", icon: Home },
  { id: "environment", label: "Environment", icon: Leaf },
  { id: "water", label: "Water & Sanitation", icon: Droplets },
  { id: "community", label: "Community Work", icon: Users },
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

const STEPS = ["Details", "Requirements", "Schedule", "Review"];

const CreateVolunteer = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Step 0: Details
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [linkedCampaign, setLinkedCampaign] = useState("");

  // Step 1: Requirements
  const [skills, setSkills] = useState<string[]>([]);
  const [spots, setSpots] = useState("10");
  const [ageMin, setAgeMin] = useState("18");
  const [commitmentType, setCommitmentType] = useState("short-term");
  const [additionalReqs, setAdditionalReqs] = useState("");

  // Step 2: Schedule
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dailyHours, setDailyHours] = useState("6");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const progress = ((step + 1) / STEPS.length) * 100;

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return title.trim() && category && location.trim() && description.trim().length >= 20;
      case 1:
        return skills.length > 0 && Number(spots) >= 1;
      case 2:
        return startDate && endDate && contactName.trim() && contactEmail.trim();
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    navigate("/");
  };

  const stepVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  const linkedCampaignData = campaigns.find((c) => c.id === linkedCampaign);

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
                className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                  i <= step ? "text-primary" : "text-muted-foreground"
                } ${i < step ? "cursor-pointer" : "cursor-default"}`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    i < step
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
                            className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                              category === cat.id
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
                    <label className="text-sm font-semibold text-foreground">
                      Link to Campaign (optional)
                    </label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Associate this request with an active campaign for visibility.
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={() => setLinkedCampaign("")}
                        className={`w-full text-left p-3 rounded-xl border-2 text-sm transition-all ${
                          linkedCampaign === ""
                            ? "border-primary bg-primary/5 text-primary font-medium"
                            : "border-border hover:border-primary/40 text-muted-foreground"
                        }`}
                      >
                        Standalone — not linked to any campaign
                      </button>
                      {campaigns.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setLinkedCampaign(c.id)}
                          className={`w-full text-left p-3 rounded-xl border-2 text-sm transition-all ${
                            linkedCampaign === c.id
                              ? "border-primary bg-primary/5 text-primary font-medium"
                              : "border-border hover:border-primary/40 text-foreground"
                          }`}
                        >
                          <span className="font-medium">{c.title}</span>
                          <span className="block text-xs text-muted-foreground mt-0.5">
                            by {c.org} • {c.progress}% funded
                          </span>
                        </button>
                      ))}
                    </div>
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
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                            skills.includes(skill)
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
                          className={`p-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                            commitmentType === opt.id
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
                      Additional Requirements (optional)
                    </label>
                    <Textarea
                      placeholder="e.g. Must be comfortable in remote areas, bring own sleeping bag..."
                      value={additionalReqs}
                      onChange={(e) => setAdditionalReqs(e.target.value)}
                      rows={3}
                    />
                  </div>
                </>
              )}

              {/* Step 2: Schedule & Contact */}
              {step === 2 && (
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
                          className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                            dailyHours === h
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

              {/* Step 3: Review */}
              {step === 3 && (
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

                    {linkedCampaignData && (
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
                        <p className="text-xs font-semibold text-primary mb-0.5">
                          Linked Campaign
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {linkedCampaignData.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          by {linkedCampaignData.org}
                        </p>
                      </div>
                    )}

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
