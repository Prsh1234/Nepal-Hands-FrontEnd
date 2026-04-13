import { useParams, Link } from "react-router-dom";
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
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const VolunteerDetails = () => {
  const { id } = useParams();
  const opportunity = getVolunteerById(id || "");
  const linkedCampaign = opportunity?.linkedCampaignId
    ? getCampaignById(opportunity.linkedCampaignId)
    : null;

  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantMessage, setApplicantMessage] = useState("");

  if (!opportunity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Opportunity Not Found</h1>
        <Link to="/">
          <Button variant="outline"><ArrowLeft size={16} className="mr-2" /> Back to Home</Button>
        </Link>
      </div>
    );
  }

  const spotsRemaining = opportunity.spots - opportunity.spotsFilled;
  const fillPercentage = Math.round((opportunity.spotsFilled / opportunity.spots) * 100);

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
              {opportunity.verified && (
                <span className="flex items-center gap-1 text-xs font-medium bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                  <CheckCircle size={12} /> Verified
                </span>
              )}
              {opportunity.urgent && (
                <span className="flex items-center gap-1 text-xs font-medium bg-red-500/30 backdrop-blur px-3 py-1 rounded-full">
                  <AlertTriangle size={12} /> Urgent Need
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">{opportunity.title}</h1>
            <p className="text-lg text-primary-foreground/85 max-w-2xl">{opportunity.description}</p>
            <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-primary-foreground/75">
              <span className="flex items-center gap-1"><MapPin size={14} /> {opportunity.location}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {opportunity.startDate} – {opportunity.endDate}</span>
              <span className="flex items-center gap-1"><Users size={14} /> by {opportunity.org}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, label: "Spots", value: `${spotsRemaining} of ${opportunity.spots} left` },
                { icon: Clock, label: "Hours/Day", value: `${opportunity.hoursPerDay}h` },
                { icon: Briefcase, label: "Commitment", value: opportunity.commitment },
                { icon: Calendar, label: "Starts In", value: `${daysUntilStart} days` },
              ].map((stat, i) => (
                <div key={i} className="bg-card rounded-xl p-4 shadow-card border border-border text-center">
                  <stat.icon size={20} className="text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-sm font-semibold text-foreground">{stat.value}</p>
                </div>
              ))}
            </motion.div>

            {/* Spots Progress */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-card rounded-xl p-6 shadow-card border border-border">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-2xl font-bold text-foreground font-display">{opportunity.spotsFilled} volunteers</p>
                  <p className="text-sm text-muted-foreground">joined of {opportunity.spots} spots needed</p>
                </div>
                <p className="text-2xl font-bold text-primary">{fillPercentage}%</p>
              </div>
              <Progress value={fillPercentage} className="h-3 mb-4" />
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Users size={14} /> {spotsRemaining} spots remaining</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {daysUntilStart} days until start</span>
                <button className="ml-auto flex items-center gap-1 hover:text-foreground transition-colors">
                  <Share2 size={14} /> Share
                </button>
              </div>
            </motion.div>

            {/* Linked Campaign */}
            {linkedCampaign && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Link to={`/campaign/${linkedCampaign.id}`}
                  className="block bg-accent/50 rounded-xl p-5 border border-primary/20 hover:border-primary/40 transition-colors group">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-2">
                    <LinkIcon size={14} /> Linked Campaign
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                        {linkedCampaign.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">{linkedCampaign.org} • {linkedCampaign.progress}% funded</p>
                    </div>
                    <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full grid grid-cols-4 bg-muted">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="team">Team ({opportunity.volunteers.length})</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
              </TabsList>

              {/* About */}
              <TabsContent value="about">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-card rounded-xl p-6 shadow-card border border-border mt-4 space-y-6">
                  <div className="prose prose-sm max-w-none text-foreground">
                    {opportunity.longDescription.split("\n\n").map((para, i) => {
                      if (para.startsWith("**") && para.includes(":**")) {
                        const title = para.match(/\*\*(.*?)\*\*/)?.[1] || "";
                        const items = para.split("\n").slice(1).map(l => l.replace(/^- /, ""));
                        return (
                          <div key={i} className="mb-4">
                            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
                            <ul className="space-y-1">
                              {items.map((item, j) => (
                                <li key={j} className="flex items-start gap-2 text-muted-foreground">
                                  <CheckCircle size={14} className="text-primary mt-1 shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      }
                      return <p key={i} className="text-muted-foreground mb-4 leading-relaxed">{para}</p>;
                    })}
                  </div>

                  {/* Skills needed */}
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Tag size={18} className="text-primary" /> Skills Needed
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.skills.map((skill) => (
                        <span key={skill} className="bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
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
                </motion.div>
              </TabsContent>

              {/* Requirements */}
              <TabsContent value="requirements">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-card rounded-xl p-6 shadow-card border border-border mt-4 space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Shield size={18} className="text-primary" /> Eligibility & Requirements
                    </h3>
                    <div className="space-y-3">
                      {opportunity.requirements.map((req, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-sm text-foreground">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Age Range</p>
                      <p className="text-lg font-bold text-foreground">{opportunity.ageMin} – {opportunity.ageMax}</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Commitment</p>
                      <p className="text-sm font-bold text-foreground">{opportunity.commitment}</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Daily Hours</p>
                      <p className="text-lg font-bold text-foreground">{opportunity.hoursPerDay}h / day</p>
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
                    {opportunity.volunteers.map((vol, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">
                              {vol.name.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">{vol.name}</p>
                            <p className="text-xs text-muted-foreground">{vol.role}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">Joined {vol.joinedDate}</span>
                      </motion.div>
                    ))}
                  </div>
                  {spotsRemaining > 0 && (
                    <div className="mt-4 p-4 bg-accent/50 rounded-lg border border-primary/20 text-center">
                      <p className="text-sm text-foreground font-medium">
                        {spotsRemaining} more volunteer{spotsRemaining > 1 ? "s" : ""} needed!
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
                        <span className="text-xs text-muted-foreground">{update.date}</span>
                        <h4 className="font-display font-semibold text-foreground mb-1">{update.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{update.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column – Application & Contact */}
          <div className="space-y-6">
            {/* Application Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-6 shadow-card border border-border sticky top-24">
              <h3 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <UserPlus size={20} className="text-primary" /> Apply to Volunteer
              </h3>

              {spotsRemaining <= 0 ? (
                <div className="text-center py-6">
                  <p className="text-foreground font-semibold mb-2">All spots are filled!</p>
                  <p className="text-sm text-muted-foreground">You can still apply to the waitlist.</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">
                  {spotsRemaining} spot{spotsRemaining > 1 ? "s" : ""} remaining — apply now!
                </p>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Full Name *</label>
                  <Input placeholder="Your full name" value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Email *</label>
                  <Input type="email" placeholder="your@email.com" value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                  <Input type="tel" placeholder="+977-..." value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Why do you want to volunteer?</label>
                  <Textarea placeholder="Share your motivation and relevant experience..."
                    value={applicantMessage} onChange={(e) => setApplicantMessage(e.target.value)} rows={4} />
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
                      {opportunity.contactName.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{opportunity.contactName}</p>
                    <p className="text-xs text-muted-foreground">{opportunity.org}</p>
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t border-border">
                  <a href={`mailto:${opportunity.contactEmail}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Mail size={14} /> {opportunity.contactEmail}
                  </a>
                  <a href={`tel:${opportunity.contactPhone}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Phone size={14} /> {opportunity.contactPhone}
                  </a>
                </div>
              </div>
            </div>

            {/* Verification */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border">
              <h4 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield size={16} className="text-primary" /> Verification
              </h4>
              <div className="space-y-3">
                {[
                  { label: "Organization Verified", status: opportunity.verified },
                  { label: "Contact Info Confirmed", status: true },
                  { label: "Background Checked", status: opportunity.verified },
                  { label: "Insurance Provided", status: opportunity.verified },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <CheckCircle size={16} className={item.status ? "text-primary" : "text-muted-foreground"} />
                    <span className={`text-sm ${item.status ? "text-foreground" : "text-muted-foreground"}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
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
