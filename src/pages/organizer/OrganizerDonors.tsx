import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { DonorList, exportDonationsCsv, getCampaignDonorList, getDonationDashboard, getOrganizerCampaignSelect } from "@/services/organizerDashboard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { Link } from "react-router-dom";

const formatNPR = (n: number) => "NPR " + n.toLocaleString("en-IN");

const OrganizerDonors = () => {
  const [campaignOps, setCampaignOps] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [direction, setDirection] = useState("desc");
  const [donorList, setDonorList] = useState<DonorList[]>([]);
  const [dashboard, setDashboard] = useState({
    totalDonors: 0,
    totalRaised: 0,
    averageDonation: 0,
  });
  useEffect(() => {

    getOrganizerCampaignSelect()
      .then(setCampaignOps)
      .catch(console.error);

  }, []);
  useEffect(() => {
    getCampaignDonorList(
      page,
      10,
      direction,
      selectedCampaign
    )
      .then((res) => {
        setDonorList(res.content);
        setTotalPages(res.totalPages);
      })
      .catch(console.error)

  }, [page, direction, selectedCampaign]);
  useEffect(() => {
    getDonationDashboard(selectedCampaign)
      .then(setDashboard)
      .catch(console.error);
  }, [selectedCampaign]);
  const handleExportCsv = async () => {
    try {
      const blob = await exportDonationsCsv(
        selectedCampaign === "all"
          ? undefined
          : selectedCampaign
      );

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "donations.csv";

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Donors</h1>
          <p className="text-sm text-muted-foreground">All contributions across your campaigns.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCsv}
        >
          <Download className="w-4 h-4 mr-1" />
          Export CSV
        </Button>      </div>
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
      <div className="grid sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Total Donors</p><p className="text-2xl font-bold font-heading">{dashboard.totalDonors}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Total Raised</p><p className="text-2xl font-bold font-heading">{formatNPR(dashboard.totalRaised)}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Average Donation</p><p className="text-2xl font-bold font-heading">{formatNPR(dashboard.averageDonation)}</p></CardContent></Card>
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
              {donorList.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">
                    {d.anonymous ? (
                      <span>{d.donorName}</span>
                    ) : (
                      <Link
                        to={`/profile/${d.donorId}`}
                        className="hover:underline"
                      >
                        {d.donorName}
                      </Link>
                    )}

                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <Link to={`/campaign/${d.campaignId}`}>
                      {d.campaignTitle}
                    </Link>
                  </TableCell>
                  <TableCell><Badge variant="outline">NPR {d.amount.toLocaleString()}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(d.donatedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" disabled={d.anonymous}><Heart className="w-4 h-4 mr-1" /> Thank</Button>
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
    </div>
  );
};

export default OrganizerDonors;
