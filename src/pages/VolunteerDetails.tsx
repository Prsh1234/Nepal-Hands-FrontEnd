
import { motion } from "framer-motion";
import { getVolunteerById } from "@/data/volunteers";
import { getCampaignById } from "@/data/campaigns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, CheckCircle, MapPin, Calendar, Users, Clock,
  Share2, Heart, Briefcase, Mail, Phone, Shield, Tag,
  AlertTriangle, Star, UserPlus, ChevronRight, Link as LinkIcon,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getVolunteerOpportunityById, VolunteerOpportunityResponse } from "@/services/volunteerService";
import { Loader2 } from "lucide-react";

















const VolunteerDetails = () => {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState<VolunteerOpportunityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getVolunteerOpportunityById(id)
      .then(setOpportunity)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantMessage, setApplicantMessage] = useState("");

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
  const spotsRemaining = opportunity.volunteerSpots; // adjust if backend returns spotsFilled separately
  const fillPercentage = 0;                          // adjust when you add applications count to response

  const daysUntilStart = Math.max(0, Math.ceil(
    (new Date(opportunity.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  ));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-xs font-semibold bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                {opportunity.category}
              </span>
              {opportunity.status === "ACTIVE" && (
                <span className="flex items-center gap-1 text-xs font-medium bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                  <CheckCircle size={12} /> Active
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
                { icon: Users, label: "Spots", value: `${opportunity.volunteerSpots} total` },
                { icon: Clock, label: "Hours/Day", value: `${opportunity.dailyHours}h` },
                { icon: Briefcase, label: "Commitment", value: opportunity.commitmentType },
                { icon: Calendar, label: "Starts In", value: `${daysUntilStart} days` },
              ].map((stat, i) => (
                <div key={i} className="bg-card rounded-xl p-4 shadow-card border border-border text-center">
                  <stat.icon size={20} className="text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-sm font-semibold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* About Tab content */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full grid grid-cols-4 bg-muted">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                {/* <TabsTrigger value="team">Team ({opportunity.volunteers.length})</TabsTrigger> */}
                <TabsTrigger value="team">Team </TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
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


            </Tabs>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-6 shadow-card border border-border sticky top-24">
              <h3 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <UserPlus size={20} className="text-primary" /> Apply to Volunteer
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Full Name *</label>
                  <Input placeholder="Your full name" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Email *</label>
                  <Input type="email" placeholder="your@email.com" value={applicantEmail} onChange={(e) => setApplicantEmail(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                  <Input type="tel" placeholder="+977-..." value={applicantPhone} onChange={(e) => setApplicantPhone(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Why do you want to volunteer?</label>
                  <Textarea placeholder="Share your motivation..." value={applicantMessage} onChange={(e) => setApplicantMessage(e.target.value)} rows={4} />
                </div>
                <Button className="w-full gap-2 text-base h-12" size="lg">
                  <Heart size={18} /> Submit Application
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  You'll receive a confirmation email within 48 hours.
                </p>
              </div>
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
      <Footer />
    </div>
  );
};

export default VolunteerDetails;















