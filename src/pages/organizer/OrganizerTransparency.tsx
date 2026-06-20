import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  ShieldCheck,
  Plus,
  FileText,
  Receipt,
  Image as ImageIcon,
  Flag,
  Upload,
  Trash2,
  Eye,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";
import { addCampaignExpenses, addCampaignImpact, CampaignExpenses, CampaignImpact, getCampaignDashboardExpenses, getCampaignDashboardImapacts, getOrganizerCampaignSelect } from "@/services/organizerDashboard";
import api from "@/lib/api";
import ImageModal from "@/modal/ImageModal";


const EXPENSE_CATEGORIES = ["Materials", "Labor", "Construction", "Transport", "Food & Lodging", "Equipment", "Admin", "Other"];
const PROOF_TYPES = ["Site Photo", "Receipt", "Bank Statement", "Audit Report", "Beneficiary List", "Field Report", "Other"];

const OrganizerTransparency = () => {
  const [expenses, setExpenses] = useState<CampaignExpenses[]>([]);
  const [impacts, setImpacts] = useState<CampaignImpact[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Dialog states
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [impactOpen, setImpactOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    campaignId: "",
    category: "",
    vendor: "",
    amount: "",
    date: "",
    fileName: "",
    file: null as File | null
  });
  const [newImpact, setNewImpact] = useState({
    campaignId: "",
    type: "",
    fileName: "",
    file: null as File | null,
  });

  // const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  // const totalRaised = mockCampaigns.reduce((s, c) => s + c.raised, 0);

  const [campaignOps, setCampaignOps] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [expensePage, setExpensePage] = useState(0);
  const [expenseTotalPages, setExpenseTotalPages] = useState(0);

  const [impactPage, setImpactPage] = useState(0);
  const [impactTotalPages, setImpactTotalPages] = useState(0);
  const [direction, setDirection] = useState("desc");
  useEffect(() => {

    getOrganizerCampaignSelect()
      .then(setCampaignOps)
      .catch(console.error);

  }, []);
  useEffect(() => {
    getCampaignDashboardExpenses(
      expensePage,
      10,
      direction,
      selectedCampaign
    )
      .then((res) => {
        setExpenses(res.content);
        setExpenseTotalPages(res.totalPages);
      })
      .catch(console.error)

  }, [expensePage, direction, selectedCampaign]);
  useEffect(() => {
    getCampaignDashboardImapacts(
      impactPage,
      10,
      direction,
      selectedCampaign
    )
      .then((res) => {
        setImpacts(res.content);
        setImpactTotalPages(res.totalPages);
      })
      .catch(console.error)

  }, [impactPage, direction, selectedCampaign]);

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
      if (mime.startsWith("image/")) {
        setSelectedImage(url);
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

      toast.error("Unsupported file type");
    } catch {
      toast.error("Failed to load document");
    }
  };
  const handleExpenseDocumentPreview = (
    expenseId: string,
    fileName: string,
    contentType?: string
  ) => {
    return previewDocument(
      `/organizer/dashboard/campaign/transparency/expenses/${expenseId}`,
      fileName,
      contentType
    );
  };
  const handleImpactDocumentPreview = (
    impactId: string,
    fileName: string,
    contentType?: string
  ) => {
    return previewDocument(
      `/organizer/dashboard/campaign/transparency/impact/${impactId}`,
      fileName,
      contentType
    );
  };
  const handleExpenseDocumentUpload = (file: File | null) => {
    setNewExpense((prev) => ({
      ...prev,
      file,
    }));
  };
  const removeExpenseDocument = () => {
    setNewExpense((prev) => ({
      ...prev,
      file: null,
    }));
  };
  const handleImpactDocumentUpload = (file: File | null) => {
    setNewImpact((prev) => ({
      ...prev,
      file,
    }));
  };
  const removeImpactDocument = () => {
    setNewImpact((prev) => ({
      ...prev,
      file: null,
    }));
  };
  const addExpense = async () => {
    if (
      !newExpense.campaignId ||
      !newExpense.category ||
      !newExpense.vendor ||
      !newExpense.amount ||
      !newExpense.date ||
      !newExpense.fileName ||
      !newExpense.file
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await addCampaignExpenses({
        campaignId: newExpense.campaignId,
        vendor: newExpense.vendor,
        amount: newExpense.amount,
        category: newExpense.category,
        file: newExpense.file,
        fileName: newExpense.fileName,
        date: newExpense.date,
      });
      const refreshed = await getCampaignDashboardExpenses(
        0,
        5,
        direction
      );

      setExpenses(refreshed.content);
      setImpactTotalPages(refreshed.totalPages);
      setNewExpense({
        campaignId: "",
        category: "",
        vendor: "",
        amount: "",
        date: "",
        fileName: "",
        file: null,
      });

      setExpenseOpen(false);

      toast.success("Expense logged successfully!");
    } catch (err: any) {
      const msg = err?.errors
        ? Object.values(err.errors).join(", ")
        : err?.message ?? "Something went wrong";

      toast.error(msg);
    }
  };

  const addProof = async () => {
    if (
      !newImpact.campaignId ||
      !newImpact.type ||
      !newImpact.fileName ||
      !newImpact.file
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await addCampaignImpact({
        campaignId: newImpact.campaignId,
        type: newImpact.type,
        file: newImpact.file,
        fileName: newImpact.fileName,
      });
      const refreshed = await getCampaignDashboardImapacts(
        0,
        5,
        direction
      );

      setImpacts(refreshed.content);
      setImpactTotalPages(refreshed.totalPages);
      setNewImpact({
        campaignId: "",
        type: "",
        fileName: "",
        file: null,
      });

      setImpactOpen(false);

      toast.success("Impact logged successfully!");
    } catch (err: any) {
      const msg = err?.errors
        ? Object.values(err.errors).join(", ")
        : err?.message ?? "Something went wrong";

      toast.error(msg);
    }
  };





  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Transparency</h1>
          <p className="text-sm text-muted-foreground">Track expenses, milestones and proof so donors see exactly where the money goes.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        {/* <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Total Raised</p><p className="text-2xl font-bold font-heading">NPR {totalRaised.toLocaleString()}</p></CardContent></Card> */}
        {/* <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Total Spent</p><p className="text-2xl font-bold font-heading">NPR {totalSpent.toLocaleString()}</p></CardContent></Card> */}
      </div>



      <Tabs defaultValue="expenses" className="w-full">
        <TabsList>
          <TabsTrigger value="expenses"><Receipt className="w-4 h-4 mr-1" /> Expenses</TabsTrigger>
          <TabsTrigger value="proofs"><FileText className="w-4 h-4 mr-1" /> Proof of Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-3">
          <div className="flex justify-end">
            <Dialog open={expenseOpen} onOpenChange={setExpenseOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Log Expense</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Log a new expense</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Campaign</Label>
                    <Select
                      value={newExpense.campaignId}
                      onValueChange={(v) => setNewExpense({ ...newExpense, campaignId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign" />
                      </SelectTrigger>

                      <SelectContent>
                        {campaignOps.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Category</Label>
                      <Select value={newExpense.category} onValueChange={(v) => setNewExpense({ ...newExpense, category: v })}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{EXPENSE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Amount (NPR)</Label>
                      <Input type="number" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Vendor / Payee</Label>
                    <Input value={newExpense.vendor} onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Date</Label>
                      <Input type="date" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs">File Name</Label>
                      <Input value={newExpense.fileName} placeholder="receipt.pdf" onChange={(e) => setNewExpense({ ...newExpense, fileName: e.target.value })} />
                    </div>
                  </div>
                  <div className="shrink-0">
                    {newExpense.file ? (
                      <button
                        type="button"
                        onClick={removeExpenseDocument}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
                      >
                        <X className="w-3 h-3" />
                        {newExpense.file.name}
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
                            handleExpenseDocumentUpload(e.target.files?.[0] || null)
                          }
                        />
                      </label>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setExpenseOpen(false)}>Cancel</Button>
                  <Button onClick={addExpense}><Upload className="w-4 h-4 mr-1" /> Log Expense</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex gap-4 flex-wrap">
            <div>
              <Label className="mb-2 block">
                Campaigns
              </Label>

              <Select
                value={selectedCampaign}
                onValueChange={(value) => {
                  setSelectedCampaign(value);
                  setExpensePage(0);
                }}
              >
                <SelectTrigger className="w-72">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">
                    All Campaigns
                  </SelectItem>

                  {campaignOps.map((c) => (
                    <SelectItem
                      key={c.id}
                      value={String(c.id)}
                    >
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">
                Order
              </Label>

              <Select
                value={direction}
                onValueChange={(value) => {
                  setDirection(value);
                  setExpensePage(0);
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="desc">
                    Newest First
                  </SelectItem>

                  <SelectItem value="asc">
                    Oldest First
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="text-sm">{new Date(e.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{e.campaignTitle}</TableCell>
                      <TableCell><Badge variant="secondary">{e.category}</Badge></TableCell>
                      <TableCell className="text-sm">{e.vendor}</TableCell>
                      <TableCell className="font-medium">NPR {e.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm"
                          onClick={() =>
                            handleExpenseDocumentPreview(e.id, e.fileName, e.contentType)
                          }>
                          <Download className="w-3 h-3 mr-1" />
                          {e.fileName}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {expenseTotalPages > 0 && (
            <div className="flex justify-center items-center gap-3">
              <Button
                variant="outline"
                disabled={expensePage === 0}
                onClick={() => setExpensePage((p) => p - 1)}
              >
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {expensePage + 1} of {expenseTotalPages}
              </span>

              <Button
                variant="outline"
                disabled={expensePage >= expenseTotalPages - 1}
                onClick={() => setExpensePage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>



        <TabsContent value="proofs" className="space-y-3">
          <div className="flex justify-end">
            <Dialog open={impactOpen} onOpenChange={setImpactOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Upload className="w-4 h-4 mr-1" /> Upload Proof</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Upload proof document</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Campaign</Label>
                    <Select
                      value={newImpact.campaignId}
                      onValueChange={(v) => setNewImpact({ ...newImpact, campaignId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign" />
                      </SelectTrigger>

                      <SelectContent>
                        {campaignOps.map((c) =>
                          <SelectItem key={c.id} value={c.id}>
                            {c.title}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Type</Label>
                    <Select value={newImpact.type} onValueChange={(v) => setNewImpact({ ...newImpact, type: v })}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>{PROOF_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">File name</Label>
                    <Input value={newImpact.fileName} placeholder="report.pdf or photo.jpg" onChange={(e) => setNewImpact({ ...newImpact, fileName: e.target.value })} />
                  </div>
                  <div className="shrink-0">
                    {newImpact.file ? (
                      <button
                        type="button"
                        onClick={removeImpactDocument}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
                      >
                        <X className="w-3 h-3" />
                        {newImpact.file.name}
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
                            handleImpactDocumentUpload(e.target.files?.[0] || null)
                          }
                        />
                      </label>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setImpactOpen(false)}>Cancel</Button>
                  <Button onClick={addProof}>Upload</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div>
            <Label className="mb-2 block">
              Order
            </Label>

            <Select
              value={direction}
              onValueChange={(value) => {
                setDirection(value);
                setImpactPage(0);
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="desc">
                  Newest First
                </SelectItem>

                <SelectItem value="asc">
                  Oldest First
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {impacts.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="flex items-center gap-2 font-medium">
                        <Button variant="ghost" size="sm"
                          onClick={() =>
                            handleImpactDocumentPreview(p.id, p.fileName, p.contentType)
                          }>
                          <Download className="w-3 h-3 mr-1" />
                          {p.fileName}
                        </Button>
                      </TableCell>
                      <TableCell><Badge variant="secondary">{p.type}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.campaignTitle}</TableCell>
                      <TableCell className="text-sm">{new Date(p.uploadedAt).toLocaleDateString()}</TableCell>
                      {/* <TableCell className="text-sm text-muted-foreground">{p.size}</TableCell> */}
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {impactTotalPages > 0 && (
            <div className="flex justify-center items-center gap-3">
              <Button
                variant="outline"
                disabled={impactPage === 0}
                onClick={() => setImpactPage((p) => p - 1)}
              >
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {impactPage + 1} of {impactTotalPages}
              </span>

              <Button
                variant="outline"
                disabled={impactPage >= impactTotalPages - 1}
                onClick={() => setImpactPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      <ImageModal
        open={!!selectedImage}
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default OrganizerTransparency;