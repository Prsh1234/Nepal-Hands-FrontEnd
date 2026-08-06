import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Users, Repeat, TrendingUp } from "lucide-react";
import api from "@/lib/api";

type PlatformDonation = {
    id: number;
    supporterName: string;
    supporterEmail: string;
    message: string | null;
    amount: number;
    currency: string;
    anonymous: boolean;
    transactionUuid: string;
    transactionCode: string | null;
    productCode: string;
    status: string;
    createdAt: string;
  };

const Stat = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <Card>
    <CardContent className="p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold font-heading mt-1">{value}</p>
      </div>
      <div className="p-3 rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
    </CardContent>
  </Card>
);

const AdminSupport = () => {
  const [rows, setRows] = useState<PlatformDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {

    const load = async () => {
      try {
  
        const response = await api.get(
          "/admin/platform-donations"
        );
  
        setRows(response.data);
  
      } catch (error) {
        console.error(
          "Failed to load platform donations",
          error
        );
      } finally {
        setLoading(false);
      }
    };
  
    load();
  
  }, []);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.trim().toLowerCase();
        const matchQ =
          !q ||
          r.supporterName.toLowerCase().toLowerCase().includes(q) ||
          r.supporterEmail.toLowerCase().includes(q);
        return matchQ ;
      }),
    [rows, search],
  );

  const total = rows.reduce((s, r) => s + Number(r.amount), 0);
  const avg = rows.length ? Math.round(total / rows.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Platform Support</h1>
        <p className="text-muted-foreground text-sm mt-1">Donations made to Nepal Hands itself, not to individual campaigns.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={Heart} label="Total received" value={`NPR ${total.toLocaleString()}`} />
        <Stat icon={Users} label="Supporters" value={rows.length.toString()} />
        <Stat icon={TrendingUp} label="Average gift" value={`NPR ${avg.toLocaleString()}`} />
      </div>

      <Card>
        <CardHeader className="gap-4">
          <div>
            <CardTitle className="text-lg">Supporters</CardTitle>
            <CardDescription>All contributions to the platform</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input placeholder="Search name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-xs" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Loading supporters...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No platform donations yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supporter</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="font-medium">{r.anonymous ? "Anonymous" : r.supporterName}</div>
                      <div className="text-xs text-muted-foreground">{r.anonymous ? "Anonymous" : r.supporterEmail}</div>
                    </TableCell>
                    <TableCell className="font-semibold">{r.currency} {Number(r.amount).toLocaleString()}</TableCell>
                    <TableCell className="max-w-[220px] truncate text-sm text-muted-foreground">{r.message || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell><Badge variant={r.status === "SUCCESS" ? "default" : "outline"} className="capitalize">{r.status.toLocaleLowerCase()}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSupport;
