import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { mockCreator } from "@/data/organizer";
import { toast } from "sonner";

const OrganizerSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Organization Settings</h1>
        <p className="text-sm text-muted-foreground">Profile, verification and notification preferences.</p>
      </div>

      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold font-heading">Verification</h2>
            <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">
              <ShieldCheck className="w-3 h-3 mr-1" /> KYC Approved
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Your KYC verification is approved. Update documents if details change.</p>
          <Button variant="outline" asChild><Link to="/kyc">Manage KYC <ArrowRight className="w-4 h-4 ml-1" /></Link></Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-4">
          <h2 className="font-semibold font-heading">Organization Profile</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Organization Name</Label>
              <Input defaultValue={mockCreator.org} />
            </div>
            <div>
              <Label className="text-xs">Contact Person</Label>
              <Input defaultValue={mockCreator.name} />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input type="email" defaultValue="contact@himalayanhope.org" />
            </div>
            <div>
              <Label className="text-xs">Phone</Label>
              <Input defaultValue="+977 9800000000" />
            </div>
          </div>
          <div>
            <Label className="text-xs">About</Label>
            <Textarea rows={3} defaultValue="We work across rural Nepal to support water, education and heritage projects." />
          </div>
          <Button onClick={() => toast.success("Profile saved")}>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-4">
          <h2 className="font-semibold font-heading">Bank Details (for payouts)</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label className="text-xs">Bank Name</Label><Input defaultValue="Nabil Bank" /></div>
            <div><Label className="text-xs">Account Holder</Label><Input defaultValue={mockCreator.org} /></div>
            <div><Label className="text-xs">Account Number</Label><Input defaultValue="01-1234567-89" /></div>
            <div><Label className="text-xs">Branch</Label><Input defaultValue="Kathmandu" /></div>
          </div>
          <Button variant="outline" onClick={() => toast.success("Bank details updated")}>Update Bank</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-3">
          <h2 className="font-semibold font-heading">Notifications</h2>
          {[
            { label: "New donations", desc: "Email when someone donates to your campaign" },
            { label: "Volunteer applications", desc: "Email when someone applies to an opportunity" },
            { label: "Payout updates", desc: "Email on payout status changes" },
            { label: "Weekly summary", desc: "Receive a weekly performance digest" },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0">
              <div>
                <p className="text-sm font-medium text-foreground">{n.label}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizerSettings;
