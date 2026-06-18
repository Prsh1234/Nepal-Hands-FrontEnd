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
import { addCampaignExpenses, CampaignExpenses, getCampaignDashboardExpenses, getOrganizerCampaignSelect } from "@/services/organizerDashboard";
import api from "@/lib/api";



type MilestoneItem = {
  id: string;
  campaign: string;
  title: string;
  target: number;
  spent: number;
  status: "completed" | "in-progress" | "upcoming";
  dueDate: string;
};

type ProofDoc = {
  id: string;
  campaign: string;
  type: string;
  name: string;
  uploadedAt: string;
  size: string;
};



const initialMilestones: MilestoneItem[] = [
  { id: "m1", campaign: "Clean Water for Dolakha", title: "Pipeline procurement", target: 200000, spent: 185000, status: "completed", dueDate: "2026-04-25" },
  { id: "m2", campaign: "Clean Water for Dolakha", title: "Phase 1 installation (3 wards)", target: 150000, spent: 96000, status: "in-progress", dueDate: "2026-05-30" },
  { id: "m3", campaign: "Clean Water for Dolakha", title: "Community handover & training", target: 100000, spent: 0, status: "upcoming", dueDate: "2026-06-20" },
  { id: "m4", campaign: "School Rebuilding in Sindhupalchok", title: "Foundation & framing", target: 500000, spent: 452000, status: "in-progress", dueDate: "2026-05-15" },
];

const initialProofs: ProofDoc[] = [
  { id: "p1", campaign: "Clean Water for Dolakha", type: "Site Photo", name: "ward2-pipeline.jpg", uploadedAt: "2026-04-29", size: "2.4 MB" },
  { id: "p2", campaign: "Clean Water for Dolakha", type: "Bank Statement", name: "april-statement.pdf", uploadedAt: "2026-05-02", size: "180 KB" },
  { id: "p3", campaign: "School Rebuilding in Sindhupalchok", type: "Audit Report", name: "q1-audit.pdf", uploadedAt: "2026-04-10", size: "640 KB" },
];

const EXPENSE_CATEGORIES = ["Materials", "Labor", "Construction", "Transport", "Food & Lodging", "Equipment", "Admin", "Other"];
const PROOF_TYPES = ["Site Photo", "Receipt", "Bank Statement", "Audit Report", "Beneficiary List", "Field Report", "Other"];

const OrganizerTransparency = () => {
  const [expenses, setExpenses] = useState<CampaignExpenses[]>([]);
  const [milestones, setMilestones] = useState<MilestoneItem[]>(initialMilestones);
  const [proofs, setProofs] = useState<ProofDoc[]>(initialProofs);

  // Dialog states
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [proofOpen, setProofOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    campaignId: "",
    category: "",
    vendor: "",
    amount: "",
    date: "",
    fileName: "",
    file: null as File | null
  });
  const [newMilestone, setNewMilestone] = useState({ campaign: "", title: "", target: "", dueDate: "" });
  const [newProof, setNewProof] = useState({ campaign: "", type: "", name: "" });

  // const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  // const totalRaised = mockCampaigns.reduce((s, c) => s + c.raised, 0);

  const [campaignOps, setCampaignOps] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [direction, setDirection] = useState("desc");
  useEffect(() => {

    getOrganizerCampaignSelect()
      .then(setCampaignOps)
      .catch(console.error);

  }, []);
  useEffect(() => {
    getCampaignDashboardExpenses(
      page,
      5,
      direction,
      selectedCampaign
    )
      .then((res) => {
        setExpenses(res.content);
        setTotalPages(res.totalPages);
      })
      .catch(console.error)

  }, [page, direction, selectedCampaign]);

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
      toast.error("Unsupported file type");
    } catch {
      toast.error("Failed to load document");
    }
  };
  const handleDocumentPreview = (
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
  const handleDocumentUpload = (file: File | null) => {
    setNewExpense((prev) => ({
      ...prev,
      file,
    }));
  };
  const removeDocument = () => {
    setNewExpense((prev) => ({
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
      const response = await addCampaignExpenses({
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
      setTotalPages(refreshed.totalPages);
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
  const addMilestone = () => {
    if (!newMilestone.campaign || !newMilestone.title || !newMilestone.target || !newMilestone.dueDate) {
      toast.error("Please fill all required fields");
      return;
    }
    setMilestones([
      ...milestones,
      { id: `m${Date.now()}`, campaign: newMilestone.campaign, title: newMilestone.title, target: Number(newMilestone.target), spent: 0, status: "upcoming", dueDate: newMilestone.dueDate },
    ]);
    setNewMilestone({ campaign: "", title: "", target: "", dueDate: "" });
    setMilestoneOpen(false);
    toast.success("Milestone added");
  };

  const addProof = () => {
    if (!newProof.campaign || !newProof.type || !newProof.name) {
      toast.error("Please fill all required fields");
      return;
    }
    setProofs([
      { id: `p${Date.now()}`, campaign: newProof.campaign, type: newProof.type, name: newProof.name, uploadedAt: new Date().toISOString().slice(0, 10), size: "120 KB" },
      ...proofs,
    ]);
    setNewProof({ campaign: "", type: "", name: "" });
    setProofOpen(false);
    toast.success("Proof document uploaded");
  };


  const removeProof = (id: string) => {
    setProofs(proofs.filter((p) => p.id !== id));
    toast.success("Document removed");
  };
  const advanceMilestone = (id: string) => {
    setMilestones(milestones.map((m) => {
      if (m.id !== id) return m;
      const next = m.status === "upcoming" ? "in-progress" : "completed";
      return { ...m, status: next };
    }));
    toast.success("Milestone status updated");
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
          <TabsTrigger value="milestones"><Flag className="w-4 h-4 mr-1" /> Milestones</TabsTrigger>
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
                        onClick={removeDocument}
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
                            handleDocumentUpload(e.target.files?.[0] || null)
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
                  setPage(0);
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
                  setPage(0);
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
                            handleDocumentPreview(e.id, e.fileName, e.contentType)
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
          {totalPages > 0 && (
            <div className="flex justify-center items-center gap-3">
              <Button
                variant="outline"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="milestones" className="space-y-3">
          <div className="flex justify-end">
            <Dialog open={milestoneOpen} onOpenChange={setMilestoneOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Milestone</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add milestone</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Campaign</Label>
                    <Select value={newMilestone.campaign} onValueChange={(v) => setNewMilestone({ ...newMilestone, campaign: v })}>
                      <SelectTrigger><SelectValue placeholder="Select campaign" /></SelectTrigger>
                      <SelectContent>{campaignOps.map((c) => <SelectItem key={c.id} value={c.title}>{c.title}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Title</Label>
                    <Input value={newMilestone.title} onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Budget (NPR)</Label>
                      <Input type="number" value={newMilestone.target} onChange={(e) => setNewMilestone({ ...newMilestone, target: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs">Due date</Label>
                      <Input type="date" value={newMilestone.dueDate} onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setMilestoneOpen(false)}>Cancel</Button>
                  <Button onClick={addMilestone}>Add Milestone</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-3">
            {milestones.map((m) => {
              const pct = Math.min(100, Math.round((m.spent / m.target) * 100));
              return (
                <Card key={m.id}>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{m.title}</p>
                        <p className="text-xs text-muted-foreground">{m.campaign} • Due {new Date(m.dueDate).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="outline" className={
                        m.status === "completed" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                          m.status === "in-progress" ? "bg-blue-100 text-blue-700 border-blue-200" :
                            "bg-muted text-muted-foreground"
                      }>
                        {m.status === "completed" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {m.status === "in-progress" && <Clock className="w-3 h-3 mr-1" />}
                        {m.status === "upcoming" && <AlertCircle className="w-3 h-3 mr-1" />}
                        {m.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>NPR {m.spent.toLocaleString()} of NPR {m.target.toLocaleString()}</span>
                        <span>{pct}%</span>
                      </div>
                      <Progress value={pct} />
                    </div>
                    {m.status !== "completed" && (
                      <div className="flex justify-end">
                        <Button size="sm" variant="outline" onClick={() => advanceMilestone(m.id)}>
                          Mark as {m.status === "upcoming" ? "In Progress" : "Completed"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="proofs" className="space-y-3">
          <div className="flex justify-end">
            <Dialog open={proofOpen} onOpenChange={setProofOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Upload className="w-4 h-4 mr-1" /> Upload Proof</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Upload proof document</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Campaign</Label>
                    <Select value={newProof.campaign} onValueChange={(v) => setNewProof({ ...newProof, campaign: v })}>
                      <SelectTrigger><SelectValue placeholder="Select campaign" /></SelectTrigger>
                      <SelectContent>{campaignOps.map((c) => <SelectItem key={c.id} value={c.title}>{c.title}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Type</Label>
                    <Select value={newProof.type} onValueChange={(v) => setNewProof({ ...newProof, type: v })}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>{PROOF_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">File name</Label>
                    <Input value={newProof.name} placeholder="report.pdf or photo.jpg" onChange={(e) => setNewProof({ ...newProof, name: e.target.value })} />
                  </div>
                  <div className="border-2 border-dashed rounded-md p-6 text-center text-xs text-muted-foreground">
                    <Upload className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    Drag & drop a file here, or click to browse
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setProofOpen(false)}>Cancel</Button>
                  <Button onClick={addProof}>Upload</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proofs.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="flex items-center gap-2 font-medium">
                        {p.type === "Site Photo" ? <ImageIcon className="w-4 h-4 text-muted-foreground" /> : <FileText className="w-4 h-4 text-muted-foreground" />}
                        {p.name}
                      </TableCell>
                      <TableCell><Badge variant="secondary">{p.type}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.campaign}</TableCell>
                      <TableCell className="text-sm">{new Date(p.uploadedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.size}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => removeProof(p.id)}><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizerTransparency;