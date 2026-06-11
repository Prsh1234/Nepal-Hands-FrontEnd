import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { recentTransactions, statusBadgeConfig } from "@/data/admin";

const statusBadge = (status: string) => {
  const c = statusBadgeConfig[status] || statusBadgeConfig.pending;
  return <Badge variant={c.variant}>{c.label}</Badge>;
};

const AdminTransactions = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold font-heading text-foreground">Transactions</h1>
      <p className="text-muted-foreground text-sm mt-1">Monitor donation transactions across the platform.</p>
    </div>
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
        <CardDescription>Latest donation activity</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Amount (NPR)</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.donor}</TableCell>
                <TableCell>{t.campaign}</TableCell>
                <TableCell className="font-semibold">{t.amount.toLocaleString()}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{t.date}</TableCell>
                <TableCell>{statusBadge(t.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default AdminTransactions;