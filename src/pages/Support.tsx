import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import PageShell from "@/components/PageShell";
import { toast } from "sonner";
import { Heart, ShieldCheck, Server, Users } from "lucide-react";
import { handleEsewaSupportPayment } from "@/services/support";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const presets = [500, 1000, 2500, 5000, 10000];

const reasons = [
  { icon: Server, title: "Keep the platform free", text: "Hosting, verification checks, and payment fees are covered by supporters — not by campaign creators." },
  { icon: ShieldCheck, title: "Fund trust & safety", text: "Every campaign and organization is manually reviewed, KYC-checked, and monitored for fraud." },
  { icon: Users, title: "Reach more communities", text: "Outreach to rural districts so local causes in Nepal can raise funds and recruit volunteers." },
];

const Support = () => {
  const [amount, setAmount] = useState<string>("1000");
  const [form, setForm] = useState({ name: "", email: "", message: "", method: "esewa", frequency: "one-time" });
  const [anonymous, setAnonymous] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const value = Number(amount);
  
    if (!value || value < 100) {
      toast.error("Please enter an amount of at least NPR 100.");
      return;
    }
  
    if (!form.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
  
    if (!form.email.trim()) {
      toast.error("Please enter your email.");
      return;
    }
  
    try {
      setSaving(true);
  
      await handleEsewaSupportPayment(value, {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        anonymous,
      });
  
      toast.success("Redirecting to eSewa...");
    } catch (err) {
      console.error(err);
      toast.error("Unable to initiate payment.");
    } finally {
      setSaving(false);
    }
  };
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
  
    if (success === "true") {
      toast.success("Thank you! Your support payment was successful.");
    }
  
    if (success === "false") {
      toast.error("Your support payment failed. Please try again.");
    }
  }, [searchParams]);
  return (
    <PageShell
      eyebrow="Support us"
      title="Help keep Nepal Hands running"
      subtitle="Nepal Hands takes no cut from campaign donations. Your support pays for verification, hosting, and the team keeping fundraising in Nepal transparent."
    >
      <div className="grid gap-8 md:grid-cols-5">
        <Card className="md:col-span-3">
          <CardContent className="p-6">
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <Label>Choose an amount (NPR)</Label>
                <div className="flex flex-wrap gap-2">
                  {presets.map((p) => (
                    <Button
                      key={p}
                      type="button"
                      variant={amount === String(p) ? "default" : "outline"}
                      onClick={() => setAmount(String(p))}
                    >
                      {p.toLocaleString()}
                    </Button>
                  ))}
                </div>
                <Input
                  type="number"
                  min={100}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Custom amount"
                  className="mt-2"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Aayush Shrestha" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (optional)</Label>
                <Textarea id="message" maxLength={500} rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Why you're supporting Nepal Hands" />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="anon" checked={anonymous} onCheckedChange={(v) => setAnonymous(Boolean(v))} />
                <Label htmlFor="anon" className="font-normal">Show my support anonymously</Label>
              </div>

              <Button type="submit" className="w-full" disabled={saving}>
                <Heart className="mr-2 h-4 w-4" />
                {saving ? "Processing..." : `Support with NPR ${Number(amount || 0).toLocaleString()}`}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-4">
          {reasons.map((r) => (
            <Card key={r.title}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <r.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{r.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{r.text}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="bg-muted/50">
            <CardContent className="p-5 text-sm text-muted-foreground leading-relaxed">
              Nepal Hands is registered in Kathmandu. For institutional giving or partnerships, reach us through the{" "}
              <a href="/contact" className="text-primary underline">contact page</a>.
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
};

export default Support;
