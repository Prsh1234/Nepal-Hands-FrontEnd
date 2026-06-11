import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getCampaignById } from "@/data/campaigns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, Heart, Clock, Users, CheckCircle, MapPin, Calendar,
  Share2, TrendingUp, FileText, CircleDollarSign, MessageSquare,
  Receipt, Flag, ShieldCheck, Download, Image as ImageIcon,
  Clock as ClockIcon, AlertCircle,
} from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const formatNPR = (n: number) =>
  "NPR " + n.toLocaleString("en-IN");

const Camdel = () => {
  const { id } = useParams();
  const campaign = getCampaignById(id || "");
  const [donationAmount, setDonationAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Campaign Not Found</h1>
        <Link to="/">
          <Button variant="outline"><ArrowLeft size={16} className="mr-2" /> Back to Home</Button>
        </Link>
      </div>
    );
  }

  const presetAmounts = [500, 1000, 2500, 5000, 10000];

  // Transparency mock data — itemized ledger, milestones and proofs
  const totalSpent = Math.round(campaign.raised * 0.62);
  const remaining = campaign.raised - totalSpent;
  const transparencyScore = 92;

  const ledger = [
    { date: "2026-04-22", category: "Materials", vendor: "Himalayan Pipes Pvt Ltd", amount: Math.round(totalSpent * 0.42), receipt: "INV-2204.pdf", verified: true },
    { date: "2026-04-28", category: "Labor", vendor: "Local Crew (12 workers)", amount: Math.round(totalSpent * 0.22), receipt: "wage-sheet-w2.pdf", verified: true },
    { date: "2026-05-01", category: "Transport", vendor: "Annapurna Logistics", amount: Math.round(totalSpent * 0.08), receipt: "transport-may.pdf", verified: true },
    { date: "2026-05-04", category: "Equipment", vendor: "Everest Hardware", amount: Math.round(totalSpent * 0.18), receipt: "eq-0504.pdf", verified: true },
    { date: "2026-05-09", category: "Admin", vendor: "Operations", amount: Math.round(totalSpent * 0.10), receipt: "admin-may.pdf", verified: false },
  ];

  const milestones = [
    { title: "Procurement & site survey", budget: Math.round(campaign.goal * 0.25), spent: Math.round(campaign.goal * 0.25), status: "completed", date: "2026-04-25" },
    { title: "Phase 1 implementation", budget: Math.round(campaign.goal * 0.40), spent: Math.round(campaign.goal * 0.28), status: "in-progress", date: "2026-05-30" },
    { title: "Community handover & training", budget: Math.round(campaign.goal * 0.20), spent: 0, status: "upcoming", date: "2026-06-20" },
    { title: "Final audit & impact report", budget: Math.round(campaign.goal * 0.15), spent: 0, status: "upcoming", date: "2026-07-10" },
  ];

  const proofs = [
    { type: "Site Photo", name: "ward2-pipeline.jpg", date: "2026-04-29", size: "2.4 MB", icon: "image" },
    { type: "Bank Statement", name: "april-statement.pdf", date: "2026-05-02", size: "180 KB", icon: "file" },
    { type: "Field Report", name: "phase1-progress.pdf", date: "2026-05-05", size: "320 KB", icon: "file" },
    { type: "Beneficiary List", name: "households-ward2.pdf", date: "2026-05-06", size: "92 KB", icon: "file" },
  ];

  const timelineIcon = (type: string) => {
    switch (type) {
      case "milestone": return <CheckCircle size={16} className="text-primary" />;
      case "financial": return <CircleDollarSign size={16} className="text-nepal-gold" />;
      case "photo": return <FileText size={16} className="text-secondary" />;
      default: return <MessageSquare size={16} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-20 text-primary-foreground">
        <div className="absolute inset-0 z-0">
          <img
            src={campaign.coverImage}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-12">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Campaigns
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                {campaign.category}
              </span>
              {campaign.verified && (
                <span className="flex items-center gap-1 text-xs font-medium bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                  <CheckCircle size={12} /> Verified
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">{campaign.title}</h1>
            <p className="text-lg text-primary-foreground/85 max-w-2xl">{campaign.description}</p>
            <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-primary-foreground/75">
              <span className="flex items-center gap-1"><MapPin size={14} /> {campaign.location}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> Started {campaign.startDate}</span>
              <span className="flex items-center gap-1"><Users size={14} /> by {campaign.org}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column – Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Funding Progress Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-card rounded-xl p-6 shadow-card border border-border">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-3xl font-bold text-foreground font-display">{formatNPR(campaign.raised)}</p>
                  <p className="text-sm text-muted-foreground">raised of {formatNPR(campaign.goal)} goal</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{campaign.progress}%</p>
                </div>
              </div>
              <Progress value={campaign.progress} className="h-3 mb-4" />
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Users size={14} /> {campaign.donors} donors</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {campaign.daysLeft} days left</span>
                <button className="ml-auto flex items-center gap-1 hover:text-foreground transition-colors">
                  <Share2 size={14} /> Share
                </button>
              </div>
            </motion.div>

            {/* Tabs: About / Updates / Transparency */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full grid grid-cols-3 bg-muted">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="updates">Updates ({campaign.updates.length})</TabsTrigger>
                <TabsTrigger value="transparency">Transparency</TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-card rounded-xl p-6 shadow-card border border-border mt-4">
                  <div className="prose prose-sm max-w-none text-foreground">
                    {campaign.longDescription.split("\n\n").map((para, i) => {
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
                  {campaign.images?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-3">Photos</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {campaign.images.slice(0, 4).map((src, i) => (
                          <motion.img
                            key={i}
                            src={src}
                            alt={`${campaign.title} photo ${i + 1}`}
                            loading="lazy"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="w-full h-40 sm:h-48 object-cover rounded-lg border border-border"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              {/* Updates Timeline Tab */}
              <TabsContent value="updates">
                <div className="mt-4 space-y-0">
                  {campaign.updates.map((update, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                      className="relative pl-8 pb-8 last:pb-0"
                    >
                      {/* Timeline line */}
                      {i < campaign.updates.length - 1 && (
                        <div className="absolute left-[11px] top-8 w-0.5 h-full bg-border" />
                      )}
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                        {timelineIcon(update.type)}
                      </div>
                      <div className="bg-card rounded-xl p-5 shadow-card border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-primary bg-accent px-2 py-0.5 rounded-full capitalize">
                            {update.type}
                          </span>
                          <span className="text-xs text-muted-foreground">{update.date}</span>
                        </div>
                        <h4 className="font-display font-semibold text-foreground mb-1">{update.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{update.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Transparency Dashboard Tab */}
              <TabsContent value="transparency">
                <div className="mt-4 space-y-6">
                  {/* Header score + totals */}
                  <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                          <ShieldCheck size={18} className="text-primary" /> Transparency Overview
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">Every rupee tracked. Every receipt public.</p>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-medium w-fit">
                        <ShieldCheck size={14} /> Transparency Score: {transparencyScore}%
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Raised</p>
                        <p className="font-display text-lg font-semibold text-foreground">{formatNPR(campaign.raised)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Spent</p>
                        <p className="font-display text-lg font-semibold text-foreground">{formatNPR(totalSpent)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Remaining</p>
                        <p className="font-display text-lg font-semibold text-foreground">{formatNPR(remaining)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Expense Breakdown */}
                  <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp size={18} className="text-primary" /> Fund Allocation
                    </h3>
                    <div className="space-y-3">
                      {campaign.expenses.map((expense, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-foreground font-medium">{expense.category}</span>
                            <span className="text-muted-foreground">{formatNPR(expense.amount)} ({expense.percentage}%)</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }} whileInView={{ width: `${expense.percentage}%` }}
                              viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1 }}
                              className="h-full rounded-full"
                              style={{
                                background: i % 2 === 0
                                  ? "hsl(var(--primary))"
                                  : "hsl(var(--secondary))",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  

                  {/* Public Expense Ledger */}
                  <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Receipt size={18} className="text-primary" /> Public Expense Ledger
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs text-muted-foreground border-b border-border">
                            <th className="py-2 pr-3 font-medium">Date</th>
                            <th className="py-2 pr-3 font-medium">Category</th>
                            <th className="py-2 pr-3 font-medium">Vendor</th>
                            <th className="py-2 pr-3 font-medium">Amount</th>
                            <th className="py-2 pr-3 font-medium">Receipt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ledger.map((row, i) => (
                            <tr key={i} className="border-b border-border/60 last:border-0">
                              <td className="py-2 pr-3 text-muted-foreground">{new Date(row.date).toLocaleDateString()}</td>
                              <td className="py-2 pr-3">
                                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-muted text-foreground">{row.category}</span>
                              </td>
                              <td className="py-2 pr-3 text-foreground">{row.vendor}</td>
                              <td className="py-2 pr-3 font-medium">{formatNPR(row.amount)}</td>
                              <td className="py-2 pr-3">
                                <button className="inline-flex items-center gap-1 text-primary hover:underline text-xs">
                                  <Download size={12} /> {row.receipt}
                                  {row.verified && <CheckCircle size={12} className="text-emerald-600" />}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Proof Documents */}
                  <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <FileText size={18} className="text-primary" /> Proof of Impact
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {proofs.map((p, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                          <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                            {p.icon === "image" ? <ImageIcon size={16} /> : <FileText size={16} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.type} • {p.size} • {new Date(p.date).toLocaleDateString()}</p>
                          </div>
                          <button className="text-muted-foreground hover:text-primary" aria-label="Download">
                            <Download size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verification Info */}
                  <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <CheckCircle size={18} className="text-primary" /> Verification Status
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "Organization Verified", status: true },
                        { label: "Documents Reviewed", status: true },
                        { label: "Site Visit Completed", status: true },
                        { label: "Financial Audit", status: campaign.progress > 50 },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <CheckCircle size={16} className={item.status ? "text-primary" : "text-muted-foreground"} />
                          <span className={`text-sm ${item.status ? "text-foreground" : "text-muted-foreground"}`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column – Donation Form & Recent Donors */}
          <div className="space-y-6">
            {/* Donation Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-6 shadow-card border border-border sticky top-24"
            >
              <h3 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Heart size={20} className="text-primary" /> Make a Donation
              </h3>

              {/* Preset amounts */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {presetAmounts.map((amt) => (
                  <button key={amt}
                    onClick={() => setDonationAmount(String(amt))}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                      donationAmount === String(amt)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
                <button
                  onClick={() => setDonationAmount("")}
                  className="py-2 px-3 rounded-lg text-sm font-medium border border-border bg-muted text-foreground hover:border-primary/50 transition-all"
                >
                  Custom
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Amount (NPR)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="text-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Your Name</label>
                  <Input
                    placeholder="Full name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    disabled={isAnonymous}
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-border"
                  />
                  Donate anonymously
                </label>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Message (optional)</label>
                  <Textarea
                    placeholder="Leave an encouraging message..."
                    value={donorMessage}
                    onChange={(e) => setDonorMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button className="w-full gap-2 text-base h-12" size="lg">
                  <Heart size={18} /> Donate Now
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  100% of your donation goes directly to this campaign. Nepal Hands charges zero platform fees.
                </p>
              </div>
            </motion.div>

            {/* Recent Donors */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border">
              <h4 className="font-display font-semibold text-foreground mb-4">Recent Supporters</h4>
              <div className="space-y-3">
                {campaign.recentDonors.map((donor, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{donor.name}</p>
                      <p className="text-xs text-muted-foreground">{donor.date}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">{formatNPR(donor.amount)}</span>
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

export default Camdel;
