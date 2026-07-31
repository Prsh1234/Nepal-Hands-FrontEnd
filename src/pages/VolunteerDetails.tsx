
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, CheckCircle, MapPin, Calendar, Users, Clock,
  Share2, Heart, Briefcase, Mail, Phone, Shield, Tag,
  AlertTriangle, Star, UserPlus, ChevronRight, Link as LinkIcon,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getVolunteerOpportunityById, VolunteerOpportunityResponse } from "@/services/volunteerService";
import { Loader2 } from "lucide-react";
import ImageModal from "@/modal/ImageModal";
import { formatDate, formatDateTime } from "@/lib/utils";
import { applyForVolunteer, getStatusData, getUserData } from "@/services/userService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { respondInvitation } from "@/services/invitationService";


type InvitationAction = {
  id: number;
  opportunityTitle: string;
};



const VolunteerDetails = () => {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState<VolunteerOpportunityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState("");
  const [invitationId, setInvitationId] = useState<number | null>(null);
  const currentUserId = Number(localStorage.getItem("userId"));

  const isOrganizer =
    opportunity?.organizerUserId === currentUserId;
  const today = new Date();

  const startDate = new Date(opportunity?.startDate);
  const endDate = new Date(opportunity?.endDate);

  const hasStarted = today >= startDate;
  const hasEnded = today > endDate;
  // If the opportunity has started OR already ended,
  // new applications are no longer accepted.
  const isApplicationClosed =
    today >= startDate || today > endDate;
  const daysUntilStart = Math.max(
    0,
    Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );

  const daysRemaining = Math.max(
    0,
    Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );
  const canAccessChat =
    applicationStatus === "APPROVED" ||
    applicationStatus === "ACCEPTED";
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [opportunityData, userData, statusData] = await Promise.all([
          getVolunteerOpportunityById(id),
          getUserData(),
          getStatusData(id),
        ]);

        setOpportunity(opportunityData);
        setApplicantEmail(userData.email);
        setApplicantName(userData.firstName + " " + userData.lastName);
        setApplicationStatus(statusData.status);

        if (statusData.invitationId) {
          setInvitationId(statusData.invitationId);
        }

        console.log(applicationStatus);


      } catch (error) {
        console.error(error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  const handleSubmit = async () => {
    if (!applicantPhone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    if (!applicantMessage.trim()) {
      toast.error("Please provide your motivation");
      return;
    }

    try {
      setSubmitting(true);
      const response = await applyForVolunteer(Number(id), {
        phone: applicantPhone,
        motivation: applicantMessage,
      });

      toast.success(response.message);
      setApplicationStatus("PENDING");
      setApplicantPhone("");
      setApplicantMessage("");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to submit application"
      );
    } finally {
      setSubmitting(false);
    }


  };
  const [action, setAction] = useState<{
    inv: InvitationAction;
    type: "accept" | "decline";
  } | null>(null); const [items, setItems] = useState([]);
  const [note, setNote] = useState("");
  const confirm = async () => {
    if (!action) return;
    await respondInvitation(
      action.inv.id,
      action.type === "accept"
        ? "ACCEPTED"
        : "DECLINED",
      note
    );

    if (action.type === "accept") {
      setApplicationStatus("APPROVED");
    }
    else {
      setApplicationStatus("REJECTED");
    }



    if (action.type === "accept") {
      toast.success("Invitation accepted!");
    } else if (action.type === "decline") {
      toast.error("Invitation declined!");
    }

    setAction(null);
    setNote("");
  };
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantMessage, setApplicantMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !opportunity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Opportunity Not Found</h1>
        <Link to="/"><Button variant="outline"><ArrowLeft size={16} className="mr-2" /> Back to Home</Button></Link>
      </div>
    );
  }

  // Derived values — now from API response shape
  const spotsLeft = opportunity.volunteerSpots - opportunity.filledSpots;
  const isTeamFull = spotsLeft <= 0;
  const fillPercentage = (opportunity.filledSpots / opportunity.volunteerSpots) * 100;



  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-20 text-primary-foreground">
        <div className="absolute inset-0 z-0">
          <img
            src={`data:image/jpeg;base64,${opportunity.coverImage}`}
            alt={opportunity.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-12">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-xs font-semibold bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                {opportunity.category}
              </span>
              {today > endDate ? (
                <span className="flex items-center gap-1 text-xs font-medium bg-red-500/20 backdrop-blur px-3 py-1 rounded-full">
                  <AlertTriangle size={12} />
                  Ended
                </span>
              ) : today >= startDate ? (
                <span className="flex items-center gap-1 text-xs font-medium bg-yellow-500/20 backdrop-blur px-3 py-1 rounded-full">
                  <Clock size={12} />
                  In Progress
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-medium bg-green-500/20 backdrop-blur px-3 py-1 rounded-full">
                  <CheckCircle size={12} />
                  Upcoming
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">{opportunity.title}</h1>
            <p className="text-lg text-primary-foreground/85 max-w-2xl">{opportunity.description}</p>
            <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-primary-foreground/75">
              <span className="flex items-center gap-1"><MapPin size={14} /> {opportunity.location}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {opportunity.startDate} – {opportunity.endDate}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: Users,
                  label: hasEnded ? "Status" : "Spots",
                  value: hasEnded
                    ? "Team Closed"
                    : `${spotsLeft} of ${opportunity.volunteerSpots} total`,
                },
                {
                  icon: Clock,
                  label: "Hours/Day",
                  value: `${opportunity.dailyHours}h`,
                },
                {
                  icon: Briefcase,
                  label: "Commitment",
                  value: opportunity.commitmentType,
                },
                {
                  icon: Calendar,
                  label: hasEnded
                    ? "Ended"
                    : hasStarted
                      ? "Days Left"
                      : "Starts In",
                  value: hasEnded
                    ? "Ended"
                    : hasStarted
                      ? `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}`
                      : `${daysUntilStart} day${daysUntilStart !== 1 ? "s" : ""}`,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-card rounded-xl p-4 shadow-card border border-border text-center"
                >
                  <stat.icon size={20} className="text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-sm font-semibold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
            {/* Spots Progress */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-card rounded-xl p-6 shadow-card border border-border">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-2xl font-bold text-foreground font-display">{opportunity.filledSpots} volunteers</p>
                  <p className="text-sm text-muted-foreground">joined of {opportunity.volunteerSpots} spots needed</p>
                </div>
                <p className="text-2xl font-bold text-primary">{fillPercentage}%</p>
              </div>
              <Progress value={fillPercentage} className="h-3 mb-4" />
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Users size={14} /> {spotsLeft} spots remaining</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {hasEnded
                    ? "Opportunity ended"
                    : hasStarted
                      ? "Applications closed"
                      : `${daysUntilStart} day${daysUntilStart !== 1 ? "s" : ""} until start`}
                </span>                <button className="ml-auto flex items-center gap-1 hover:text-foreground transition-colors">
                  <Share2 size={14} /> Share
                </button>
              </div>
              {canAccessChat && (
                <Link
                  to={`/volunteer/chat/${opportunity.id}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors px-4 py-2 text-sm font-semibold text-primary"
                >
                  Open Team Chat
                </Link>
              )}
            </motion.div>
            {/* About Tab content */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full grid grid-cols-4 bg-muted">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                {/* <TabsTrigger value="team">Team ({opportunity.volunteers.length})</TabsTrigger> */}
                <TabsTrigger value="team">Team ({opportunity.team.length}) </TabsTrigger>
                <TabsTrigger value="updates">Updates({opportunity.updates?.length || 0})</TabsTrigger>
              </TabsList>

              <TabsContent value="about">


                <div className="bg-card rounded-xl p-6 shadow-card border border-border mt-4 space-y-6">
                  <div className="mb-4">
                    {opportunity.longDescription
                      ?.split("\n\n")
                      .filter(Boolean)
                      .map((para, i) => (
                        <p
                          key={i}
                          className="text-muted-foreground mb-4 leading-relaxed"
                        >
                          {para}
                        </p>
                      ))}
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      What Volunteers Will Do
                    </h3>
                    <ul className="space-y-1">
                      {opportunity.activities
                        ?.filter(item => item.trim() !== "")
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
                  <div className="mb-4">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      Why It Matters
                    </h3>

                    <ul className="space-y-1">
                      {opportunity.whyItMatters
                        ?.split("\n")
                        .filter(Boolean)
                        .map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle size={14} className="text-primary mt-1 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Tag size={18} className="text-primary" /> Skills Needed
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.requiredSkills.map((skill) => (
                        <span key={skill} className="bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Star size={18} className="text-primary" /> What You Get
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {opportunity.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                          <CheckCircle size={14} className="text-primary mt-0.5 shrink-0" />
                          <span className="text-sm text-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {opportunity.images?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                        Photos
                      </h3>

                      <div className="grid grid-cols-2 gap-3">
                        {opportunity.images.slice(0, 4).map((src, i) => (
                          <motion.img
                            key={i}
                            src={`data:image/jpeg;base64,${src}`}
                            alt={`${opportunity.title} photo ${i + 1}`}
                            loading="lazy"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            onClick={() => setSelectedImage(`data:image/jpeg;base64,${src}`)}
                            className="w-full h-40 sm:h-48 object-cover rounded-lg border border-border"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="requirements">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-card rounded-xl p-6 shadow-card border border-border mt-4 space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Shield size={18} className="text-primary" /> Eligibility & Requirements
                    </h3>
                    <div className="space-y-3">
                      {opportunity.requirements?.map((req, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                        >
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                            {i + 1}
                          </span>

                          <span className="text-sm text-foreground">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-card rounded-xl p-6 shadow-card border border-border mt-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Min Age</p>
                        <p className="text-lg font-bold text-foreground">{opportunity.minimumAge}+</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Commitment</p>
                        <p className="text-sm font-bold text-foreground">{opportunity.commitmentType}</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Daily Hours</p>
                        <p className="text-lg font-bold text-foreground">{opportunity.dailyHours}h / day</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Team */}
              <TabsContent value="team">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-card rounded-xl p-6 shadow-card border border-border mt-4">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Users size={18} className="text-primary" /> Current Volunteers
                  </h3>
                  <div className="space-y-3">
                    {opportunity.team.map((vol, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">
                              {vol.fullName.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">{vol.fullName}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">Joined {formatDate(vol.joinedAt)}</span>
                      </motion.div>
                    ))}
                  </div>
                  {isTeamFull ? (
                    <div className="mt-4 p-4 rounded-lg border border-red-200 bg-red-50 text-center">
                      <p className="font-semibold text-red-600">
                        Team Full
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        This volunteer opportunity has reached its maximum capacity.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-accent/50 rounded-lg border border-primary/20 text-center">
                      <p className="text-sm text-foreground font-medium">
                        {spotsLeft} more volunteer{spotsLeft > 1 ? "s" : ""} needed!
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Apply using the form on the right →</p>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              {/* Updates */}
              <TabsContent value="updates">
                <div className="mt-4 space-y-0">
                  {opportunity.updates.map((update, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                      className="relative pl-8 pb-8 last:pb-0">
                      {i < opportunity.updates.length - 1 && (
                        <div className="absolute left-[11px] top-8 w-0.5 h-full bg-border" />
                      )}
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                        <CheckCircle size={12} className="text-primary" />
                      </div>
                      <div className="bg-card rounded-xl p-5 shadow-card border border-border">
                        <span className="text-xs text-muted-foreground">{formatDateTime(update.date)}</span>
                        <h4 className="font-display font-semibold text-foreground mb-1">{update.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{update.body}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>


          </div>

          {/* Right Column */}
          <div className="relative self-start">

            <div className="sticky top-24 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-xl p-6 shadow-card border border-border"
              >
                <h3 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <UserPlus size={20} className="text-primary" /> Apply to Volunteer
                </h3>
                {isOrganizer ? (
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 text-center">
                    <Users className="mx-auto mb-3 text-blue-600" size={40} />
                    <h4 className="text-lg font-semibold">
                      You are the organizer
                    </h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      Organizers cannot apply to their own volunteer opportunity.
                    </p>
                  </div>
                ) : isTeamFull ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                    <Users className="mx-auto mb-3 text-red-600" size={40} />
                    <h4 className="text-lg font-semibold">
                      Team is Full
                    </h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      All volunteer positions have already been filled.
                    </p>
                  </div>
                ) : isApplicationClosed ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
                    <AlertTriangle className="mx-auto mb-3 text-amber-600" size={40} />
                    <h4 className="text-lg font-semibold">
                      Applications Closed
                    </h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      {today > endDate
                        ? "This volunteer opportunity has ended."
                        : "This volunteer opportunity has already started. Applications are no longer being accepted."}
                    </p>
                  </div>
                ) : applicationStatus === "NOT_APPLIED" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Full Name *
                      </label>
                      <Input
                        value={applicantName}
                        readOnly
                        className="bg-muted cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={applicantEmail}
                        readOnly
                        className="bg-muted cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Phone
                      </label>
                      <Input
                        type="tel"
                        placeholder="+977-..."
                        value={applicantPhone}
                        disabled={submitting}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Why do you want to volunteer?
                      </label>
                      <Textarea
                        placeholder="Share your motivation..."
                        value={applicantMessage}
                        disabled={submitting}
                        onChange={(e) => setApplicantMessage(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full gap-2 text-base h-12"
                      size="lg"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Heart size={18} />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-xl border p-6 text-center">
                    {applicationStatus === "PENDING" && (
                      <>
                        <Clock className="mx-auto mb-3 text-yellow-500" size={40} />
                        <h4 className="font-semibold text-lg">Application Pending</h4>
                        <p className="text-sm text-muted-foreground mt-2">
                          Your application is currently under review.
                        </p>
                      </>
                    )}

                    {applicationStatus === "APPROVED" && (
                      <>
                        <CheckCircle className="mx-auto mb-3 text-green-500" size={40} />
                        <h4 className="font-semibold text-lg">Congratulations</h4>
                        <p className="text-sm text-muted-foreground mt-2">
                          You are in the Team!
                        </p>
                      </>
                    )}

                    {applicationStatus === "REJECTED" && (
                      <>
                        <AlertTriangle className="mx-auto mb-3 text-red-500" size={40} />
                        <h4 className="font-semibold text-lg">Application Rejected</h4>
                        <p className="text-sm text-muted-foreground mt-2">
                          Unfortunately, your application was not selected.
                        </p>
                      </>
                    )}

                    {applicationStatus === "INVITED" && (
                      <>
                        <CheckCircle
                          className="mx-auto mb-3 text-green-500"
                          size={40}
                        />

                        <h4 className="font-semibold text-lg">
                          Invitation
                        </h4>

                        <p className="text-sm text-muted-foreground mt-2">
                          You have been invited to join this opportunity.
                        </p>


                        <div className="flex gap-2 justify-center mt-4">

                          <Button
                            size="sm"
                            onClick={() =>
                              setAction({
                                inv: {
                                  id: invitationId!,
                                  opportunityTitle: opportunity.title
                                },
                                type: "accept"
                              })
                            }
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Accept
                          </Button>


                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setAction({
                                inv: {
                                  id: invitationId!,
                                  opportunityTitle: opportunity.title
                                },
                                type: "decline"
                              })
                            }
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Decline
                          </Button>

                        </div>
                      </>
                    )}

                    {applicationStatus === "WITHDRAWN" && (
                      <>
                        <AlertTriangle className="mx-auto mb-3 text-gray-500" size={40} />
                        <h4 className="font-semibold text-lg">Application Withdrawn</h4>
                        <p className="text-sm text-muted-foreground mt-2">
                          You have withdrawn this application.
                        </p>
                      </>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Contact Info */}
              <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                <h4 className="font-display font-semibold text-foreground mb-4">Contact Person</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {opportunity.contactName.split(" ").map((n: string) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{opportunity.contactName}</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-border">
                    <a href={`mailto:${opportunity.contactEmail}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Mail size={14} /> {opportunity.contactEmail}
                    </a>
                    {opportunity.contactPhone && (
                      <a href={`tel:${opportunity.contactPhone}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Phone size={14} /> {opportunity.contactPhone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ImageModal
        open={!!selectedImage}
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
      <Dialog open={!!action} onOpenChange={(o) => !o && (setAction(null), setNote(""))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action?.type === "accept" ? "Accept invitation" : "Decline invitation"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {action?.type === "accept"
              ? `You're accepting the invitation to "${action?.inv.opportunityTitle}". The organizer will be notified.`
              : `You're declining the invitation to "${action?.inv.opportunityTitle}". A short reason helps organizers.`}
          </p>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={action?.type === "accept" ? "Optional message to the organizer" : "Reason (optional)"}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAction(null); setNote(""); }}>Cancel</Button>
            <Button onClick={confirm} variant={action?.type === "decline" ? "destructive" : "default"}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Footer />

    </div >
  );
};

export default VolunteerDetails;















