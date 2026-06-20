import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, Heart, Clock, Users, CheckCircle, MapPin, Calendar,
  Share2, TrendingUp, FileText, CircleDollarSign, MessageSquare,
  Loader2,
  Receipt,
  Download,
  ImageIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCampaignById, CampaignResponse, DonorResponse, getCampaignExpenses, getCampaignImpacts } from "@/services/campaignService";
import ImageModal from "@/modal/ImageModal";
import { formatDateTime } from "@/lib/utils";
import { handleEsewaCampaignPayment } from "@/services/payment";
import { CampaignExpenses, CampaignImpact } from "@/services/organizerDashboard";
import api from "@/lib/api";
import { toast } from "sonner";

const formatNPR = (n: number) =>
  "NPR " + n.toLocaleString("en-IN");

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<CampaignResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [donationAmount, setDonationAmount] = useState<number | null>(0);
  const [anonymous, setAnonymous] = useState(false);
  const [expenses, setExpenses] = useState<CampaignExpenses[]>([]);
  const [impact, setImpacts] = useState<CampaignImpact[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const progress = campaign
    ? campaign.goal > 0
      ? Math.min((campaign.raised / campaign.goal) * 100, 100)
      : 0
    : 0;
  const daysLeft = campaign
    ? Math.ceil(
      (new Date(campaign.endDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
    )
    : 0;
  useEffect(() => {
    if (!id) return; setLoading(true);
    getCampaignById(id)
      .then(setCampaign)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

  }, [id]);
  useEffect(() => {
    if (!id) return;

    getCampaignExpenses(id)
      .then((res) => {
        setExpenses(res);
      })
      .catch(console.error);
    getCampaignImpacts(id)
      .then((res) => {
        setImpacts(res);
      })
      .catch(console.error);
  }, [id]);
  const previewDocument = async (
    endpoint: string,
    fileName: string,
    contentType?: string
  ) => {
    try {
      const res = await api.get(endpoint, {
        responseType: "blob",
      });

      const rawHeader = res.headers["content-type"];

      const mime =
        typeof rawHeader === "string"
          ? rawHeader
          : Array.isArray(rawHeader)
            ? rawHeader[0]
            : contentType || "";

      const blob = new Blob([res.data], { type: mime });

      const url = window.URL.createObjectURL(blob);

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 60000);

      const ext = fileName.split(".").pop()?.toLowerCase();

      if (mime.includes("pdf") || ext === "pdf") {
        window.open(url, "_blank");
        return;
      }

      if (ext === "docx" || ext === "doc") {
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        return;
      }

      if (
        mime.startsWith("text/") ||
        ext === "txt" ||
        ext === "csv" ||
        ext === "json"
      ) {
        window.open(url, "_blank");
        return;
      }
      if (mime.startsWith("image/")) {
        setSelectedImage(url);
        return;
      }
      toast.error("Unsupported file type");
    } catch {
      toast.error("Failed to load document");
    }
  };
  
  const handleImpactDocumentPreview = (
    impactId: string,
    fileName: string,
    contentType?: string
  ) => {
    return previewDocument(
      `/volunteer/campaign/transparency/impacts/file/${impactId}`,
      fileName,
      contentType
    );
  };
  const handleDocumentPreview = (
    expenseId: string,
    fileName: string,
    contentType?: string
  ) => {
    return previewDocument(
      `/volunteer/campaign/transparency/expenses/file/${expenseId}`,
      fileName,
      contentType
    );
  };
  const handlePaymentClick = async () => {
    if (!donationAmount || !campaign?.id) return;
    await handleEsewaCampaignPayment(donationAmount, campaign?.id, anonymous,);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Campaign Not Found</h1>
        <Link to="/"><Button variant="outline"><ArrowLeft size={16} className="mr-2" /> Back to Home</Button></Link>
      </div>
    );
  }

  const presetAmounts = [500, 1000, 2500, 5000, 10000];



  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-20 text-primary-foreground">
        <div className="absolute inset-0 z-0">
          <img
            src={`data:image/jpeg;base64,${campaign.coverImage}`}
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
              {campaign.status === "ACTIVE" && (
                <span className="flex items-center gap-1 text-xs font-medium bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                  <CheckCircle size={12} /> Active
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">{campaign.title}</h1>
            <p className="text-lg text-primary-foreground/85 max-w-2xl">{campaign.description}</p>
            <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-primary-foreground/75">
              <span className="flex items-center gap-1"><MapPin size={14} /> {campaign.location}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> Started {campaign.startDate}</span>
              <span className="flex items-center gap-1"><Users size={14} /> by {campaign.organizer}</span>
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
                  <p className="text-2xl font-bold text-primary">{progress.toFixed(2)}%</p>
                </div>
              </div>
              <Progress value={progress} className="h-3 mb-4" />
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Users size={14} /> {campaign.totalDonors} donors</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {daysLeft > 0
                    ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`
                    : "Campaign ended"}
                </span>
              </div>
            </motion.div>

            {/* Tabs: About / Updates / Transparency */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full grid grid-cols-3 bg-muted">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="updates">  Updates ({campaign.updates?.length || 0})</TabsTrigger>
                <TabsTrigger value="transparency">Transparency</TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-card rounded-xl p-6 shadow-card border border-border mt-4">
                  <div className="mb-4">
                    {campaign.longDescription
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
                      Key Objectives:
                    </h3>
                    <ul className="space-y-1">
                      {campaign.projectScope
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
                  {campaign.images?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                        Photos
                      </h3>

                      <div className="grid grid-cols-2 gap-3">
                        {campaign.images.slice(0, 4).map((src, i) => (
                          <motion.img
                            key={i}
                            src={`data:image/jpeg;base64,${src}`}
                            alt={`${campaign.title} photo ${i + 1}`}
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
                </motion.div>
              </TabsContent>

              {/* Updates Timeline Tab */}
              <TabsContent value="updates">
                <div className="mt-4 space-y-0">
                  {campaign.updates?.map((update, i) => (
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
                        <CheckCircle size={16} className="text-primary" />                      </div>
                      <div className="bg-card rounded-xl p-5 shadow-card border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">{formatDateTime(update.date)}</span>
                        </div>
                        <h4 className="font-display font-semibold text-foreground mb-1">{update.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{update.body}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Transparency Dashboard Tab */}
              <TabsContent value="transparency">
                <div className="mt-4 space-y-6">

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
                          {expenses.map((row, i) => (
                            <tr key={i} className="border-b border-border/60 last:border-0">
                              <td className="py-2 pr-3 text-muted-foreground">{new Date(row.date).toLocaleDateString()}</td>
                              <td className="py-2 pr-3">
                                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-muted text-foreground">{row.category}</span>
                              </td>
                              <td className="py-2 pr-3 text-foreground">{row.vendor}</td>
                              <td className="py-2 pr-3 font-medium">{formatNPR(Number(row.amount))}</td>
                              <td className="py-2 pr-3">
                                <button className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                                  onClick={() =>
                                    handleDocumentPreview(row.id, row.fileName, row.contentType)
                                  }>
                                  <Download size={12} /> {row.fileName}
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
                      {impact.map((p, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                          <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                            {p.contentType?.startsWith("image/") ? (
                              <ImageIcon size={16} />
                            ) : (
                              <FileText size={16} />
                            )}                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{p.fileName}</p>
                            <p className="text-xs text-muted-foreground">{p.type} • {new Date(p.uploadedAt).toLocaleDateString()}</p>
                          </div>
                          <button className="text-muted-foreground hover:text-primary" aria-label="Download">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleImpactDocumentPreview(p.id, p.fileName, p.contentType)
                              }>
                              <Download className="w-3 h-3 mr-1" />
                            </Button>
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
          <div className="relative self-start">
            <div className="sticky top-24 space-y-6">
              {/* Donation Form */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-card rounded-xl p-6 shadow-card border border-border"
              >
                <h3 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Heart size={20} className="text-primary" /> Make a Donation
                </h3>

                {/* Preset amounts */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {presetAmounts.map((amt) => (
                    <button key={amt}
                      onClick={() => setDonationAmount(Number(amt))}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${donationAmount === Number(amt)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-foreground border-border hover:border-primary/50"
                        }`}
                    >
                      {formatNPR(amt)}
                    </button>
                  ))}
                  <button
                    onClick={() => setDonationAmount(0)}
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
                      onChange={(e) => setDonationAmount(Number(e.target.value))}
                      className="text-lg font-semibold"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                      className="rounded border-border"
                    />
                    Donate anonymously
                  </label>


                  <Button className="w-full gap-2 text-base h-12" size="lg" onClick={handlePaymentClick}>
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
                        {donor.donorId ? (
                          <Link to={`/profile/${donor.donorId}`}>
                            <p className="text-sm font-medium text-foreground">
                              {donor.donorName}
                            </p>
                          </Link>
                        ) : (
                          <p className="text-sm font-medium text-foreground">
                            {donor.donorName}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">{formatDateTime(donor.donatedAt)} </p>
                      </div>
                      <span className="text-sm font-semibold text-primary">{formatNPR(donor.amount)}</span>
                    </div>
                  ))}
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
      <Footer />
      
    </div>
  );
};

export default CampaignDetails;
