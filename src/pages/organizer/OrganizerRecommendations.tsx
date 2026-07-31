import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Sparkles, MapPin, Star, CheckCircle2, Send, Search } from "lucide-react";
import { type VolunteerProfile } from "@/data/volunteerProfiles";
import { toast } from "@/hooks/use-toast";
import { getRecommendations } from "@/services/recommendationService";
import { getOrganizerVolunteerSelect } from "@/services/organizerDashboard";
import { sendInvitation } from "@/services/invitationService";

const SKILL_OPTIONS = [
  "Teaching", "First Aid", "Medical", "Construction", "Engineering",
  "IT & Digital", "Photography", "Translation", "Cooking", "Driving",
  "Project Management", "Social Work", "Counseling", "Agriculture",
];
const INTEREST_OPTIONS = [
  "Education", "Healthcare", "Women Empowerment", "Environment", "Disaster Relief",
  "Culture & Heritage", "Community Development", "Children", "Rural Development",
];

const OrganizerRecommendations = () => {
  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Teaching"]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Education"]);

  const [inviteTarget, setInviteTarget] = useState<VolunteerProfile | null>(null);
  const [volunteerOps, setVolunteerOps] = useState([]);
  const [opId, setOpId] = useState<string>(volunteerOps[0]?.id ?? "");
  const [inviteMsg, setInviteMsg] = useState(
    "We reviewed your profile and think you'd be a great fit for this opportunity."
  );

  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVolunteers();
  }, [search, selectedSkills, selectedInterests]);
  useEffect(() => {
    getOrganizerVolunteerSelect()
      .then(setVolunteerOps)
      .catch(console.error);
  }, []);
  const fetchVolunteers = async () => {

    try {

      setLoading(true);

      const params: any = {};

      if (search.trim())
        params.search = search;

      if (selectedSkills.length)
        params.skills = selectedSkills;

      if (selectedInterests.length)
        params.causes = selectedInterests;

      const data = await getRecommendations(params);

      setVolunteers(data);
      console.log(data);
    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };
  const toggle = (arr: string[], set: (v: string[]) => void, val: string) => {
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const handleSend = async () => {
    if (!inviteTarget) return;
  
    try {
      const response = await sendInvitation({
        volunteerId: inviteTarget.id,
        opportunityId: opId,
        message: inviteMsg,
      });
  
      if (response.status === "success") {
        toast({
          title: "Success",
          description: response.message,
        });
  
        setInviteTarget(null);
        setInviteMsg("");
      } else {
        toast({
          title: "Failed",
          description: response.message,
          variant: "destructive",
        });
      }
  
    } catch (error) {
      console.error(error.response?.data?.message);
  
      toast({
        title: "Failed",
        description:
          error.response?.data?.message ||
          "Could not send invitation.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> Volunteer Recommendations
        </h1>
        <p className="text-sm text-muted-foreground">
          Discover volunteers matched to your opportunity's needs and invite them directly.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Match criteria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, location, or keyword"
              className="pl-9"
            />
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Required skills
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {SKILL_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggle(selectedSkills, setSelectedSkills, s)}
                  className={`text-xs px-3 py-1 rounded-full border transition ${selectedSkills.includes(s)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Interests / causes
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {INTEREST_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggle(selectedInterests, setSelectedInterests, s)}
                  className={`text-xs px-3 py-1 rounded-full border transition ${selectedInterests.includes(s)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        
        </CardContent>
      </Card>

      <div className="space-y-3">
        {volunteers && volunteers.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground">{volunteers.length} matches — sorted by best fit.</p>
            {volunteers.map((v) => (
              <Card key={v.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl font-heading mx-auto overflow-hidden">
                      {v.avatar ? (
                        <img
                          src={`data:image/jpeg;base64,${v.avatar}`}
                          alt={`${v.name} `}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        `${v.name?.charAt(0).toUpperCase() ?? ""}`
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading font-semibold text-foreground">{v.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{v.location}</span>
                        <span>Age {v.age}</span>
                        <span>{v.completedOps} ops completed</span>
                        <span>{v.availability}</span>
                      </p>
                      <p className="text-sm text-foreground mt-2">{v.bio}</p>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {v.skills?.map((s) => (
                          <Badge key={s} variant="secondary" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {v.causes.map((s) => (
                          <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                        ))}
                      </div>


                      {v.pastExperience?.length > 0 && (
                        <div className="mt-3 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Past experience:
                          </span>{" "}
                          {v.pastExperience.map((e, i) => (
                            <span key={i}>
                              {e.title} ({e.org}, {e.year})
                              {i < v.pastExperience.length - 1 ? " · " : ""}
                            </span>
                          ))}
                        </div>
                      )}


                    </div>
                    <div className="shrink-0 md:pt-1">
                      <Button onClick={() => setInviteTarget(v)} size="sm">
                        <Send className="w-4 h-4 mr-1" /> Invite
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No matching volunteers found.
          </p>
        )}

      </div>

      <Dialog open={!!inviteTarget} onOpenChange={(o) => !o && setInviteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite {inviteTarget?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Opportunity</Label>
              <Select value={opId} onValueChange={setOpId}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {volunteerOps.map((o) => (
                    <SelectItem key={o.id} value={o.id}>{o.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Personal message</Label>
              <Textarea
                rows={4}
                value={inviteMsg}
                onChange={(e) => setInviteMsg(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteTarget(null)}>Cancel</Button>
            <Button onClick={handleSend}><Send className="w-4 h-4 mr-1" /> Send invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerRecommendations;