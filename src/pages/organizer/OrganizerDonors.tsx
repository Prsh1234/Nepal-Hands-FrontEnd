import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Heart } from "lucide-react";
import { mockDonors } from "@/data/organizer";

const OrganizerDonors = () => {
  const total = mockDonors.reduce((s, d) => s + d.amount, 0);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Donors</h1>
          <p className="text-sm text-muted-foreground">All contributions across your campaigns.</p>
        </div>
        <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Export CSV</Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Total Donors</p><p className="text-2xl font-bold font-heading">{mockDonors.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Total Raised</p><p className="text-2xl font-bold font-heading">NPR {total.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Average Donation</p><p className="text-2xl font-bold font-heading">NPR {Math.round(total / mockDonors.length).toLocaleString()}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDonors.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">
                    {d.name}
                    {d.anonymous && <Badge variant="secondary" className="ml-2 text-xs">Anonymous</Badge>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{d.campaign}</TableCell>
                  <TableCell><Badge variant="outline">NPR {d.amount.toLocaleString()}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(d.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" disabled={d.anonymous}><Heart className="w-4 h-4 mr-1" /> Thank</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizerDonors;
