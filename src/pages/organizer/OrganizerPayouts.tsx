import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, Download } from "lucide-react";
import { mockPayouts } from "@/data/organizer";

const statusConfig: Record<string, { className: string }> = {
  paid: { className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  processing: { className: "bg-amber-100 text-amber-700 border-amber-200" },
  failed: { className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const OrganizerPayouts = () => {
  const total = mockPayouts.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pending = mockPayouts.filter((p) => p.status === "processing").reduce((s, p) => s + p.amount, 0);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Payouts</h1>
          <p className="text-sm text-muted-foreground">Track funds disbursed to your bank account.</p>
        </div>
        <Button><Wallet className="w-4 h-4 mr-1" /> Request Payout</Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Total Disbursed</p><p className="text-2xl font-bold font-heading">NPR {total.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Processing</p><p className="text-2xl font-bold font-heading">NPR {pending.toLocaleString()}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayouts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.campaign}</TableCell>
                  <TableCell>NPR {p.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.method}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(p.date).toLocaleDateString()}</TableCell>
                  <TableCell><Badge variant="outline" className={statusConfig[p.status].className + " capitalize"}>{p.status}</Badge></TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizerPayouts;
