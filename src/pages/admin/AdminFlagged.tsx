import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Ban, CheckCircle, AlertTriangle } from "lucide-react";
import { flaggedItems } from "@/data/admin";

const AdminFlagged = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold font-heading text-foreground">Flagged & Reported Items</h1>
      <p className="text-muted-foreground text-sm mt-1">Items reported by users that need moderation.</p>
    </div>
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Reports Queue</CardTitle>
        <CardDescription>Review reports and take moderation action</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Reports</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flaggedItems.map((f) => (
              <TableRow key={f.id}>
                <TableCell><Badge variant={f.type === "User" ? "secondary" : "outline"}>{f.type}</Badge></TableCell>
                <TableCell className="font-medium">{f.title}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{f.reason}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 text-destructive font-medium">
                    <AlertTriangle className="h-3 w-3" /> {f.reportedBy}
                  </span>
                </TableCell>
                <TableCell>{f.date}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                  <Button size="sm" variant="destructive"><Ban className="h-4 w-4" /></Button>
                  <Button size="sm" variant="outline"><CheckCircle className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default AdminFlagged;