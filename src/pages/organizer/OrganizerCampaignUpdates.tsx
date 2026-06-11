import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Calendar } from "lucide-react";
import { toast } from "sonner";
import { createCampaignUpdate, getOrganizerCampaignSelect, getOrganizerCampaignUpdates } from "@/services/organizerDashboard";

const OrganizerCampaignUpdates = () => {
  const [campaignId, setCampaignId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [updates, setUpdates] = useState([]);
  const [campaignOps, setCampaignOps] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("all");

  const [direction, setDirection] = useState("desc");

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);
  useEffect(() => {

    getOrganizerCampaignSelect()
      .then(setCampaignOps)
      .catch(console.error);
  }, []);


  useEffect(() => {
    setLoading(true);
  
    getOrganizerCampaignUpdates(
      page,
      10,
      direction,
      selectedCampaign
    )
      .then((res) => {
        setUpdates(res.content);
        setTotalPages(res.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, direction, selectedCampaign]);

  const submit = async () => {
    if (!campaignId || !title || !body)
      return toast.error("Fill all fields");

    try {
      await createCampaignUpdate({
        id: campaignId,
        title,
        body,
      });

      toast.success("Update posted");

      setCampaignId("");
      setTitle("");
      setBody("");

      setPage(0);

      const refreshed = await getOrganizerCampaignUpdates(
        0,
        10,
        direction,
        campaignId
      );

      setUpdates(refreshed.content);
      setTotalPages(refreshed.totalPages);
    } catch (err) {
      toast.error("Failed to post update");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Campaign Updates</h1>
        <p className="text-sm text-muted-foreground">Keep donors and volunteers informed of progress.</p>
      </div>

      <Card>
        <CardContent className="p-5 space-y-3">
          <h2 className="font-semibold font-heading">Post a new update</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Campaign</Label>
              <Select value={campaignId} onValueChange={setCampaignId}>
                <SelectTrigger><SelectValue placeholder="Select campaign" /></SelectTrigger>
                <SelectContent>
                  {campaignOps.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Milestone reached..." />
            </div>
          </div>
          <div>
            <Label className="text-xs">Message</Label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="Share progress, photos, gratitude..." />
          </div>
          <div className="flex justify-end">
            <Button onClick={submit}><Plus className="w-4 h-4 mr-1" /> Post Update</Button>
          </div>
        </CardContent>
      </Card>
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
      <div className="space-y-3">
        <h2 className="font-semibold font-heading">Recent updates</h2>
        {updates.map((u) => (
          <Card key={u.id}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">{u.campaignTitle}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(u.date).toLocaleDateString()}</span>
              </div>
              <p className="font-semibold font-heading text-foreground">{u.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{u.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
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

export default OrganizerCampaignUpdates;
