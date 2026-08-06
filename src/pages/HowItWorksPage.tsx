import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageShell from "@/components/PageShell";
import { UserPlus, Search, Heart, BarChart3, ShieldCheck, HandHelping, Wallet, FileCheck } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Create your account", body: "Sign up as a donor, volunteer, or campaign creator. Verify your identity with KYC to unlock fundraising and organizing." },
  { icon: Search, title: "Discover causes", body: "Browse verified campaigns and volunteer opportunities filtered by category, district, and urgency." },
  { icon: Heart, title: "Contribute", body: "Donate securely in NPR via eSewa, or apply to volunteer with the skills you already have." },
  { icon: BarChart3, title: "Track your impact", body: "Follow the public ledger, milestones, and proof-of-impact updates for every campaign you support." },
];

const donors = [
  { icon: ShieldCheck, title: "Verified campaigns only", body: "Every campaign passes document review — registration, PAN/VAT, and signatory checks — before going live." },
  { icon: Wallet, title: "Transparent spending", body: "Organizers publish expense ledgers with receipts so you can see exactly where each rupee goes." },
];

const organizers = [
  { icon: FileCheck, title: "Submit for approval", body: "Complete the guided wizard with your goal, story, media, and proof of authenticity documents." },
  { icon: HandHelping, title: "Recruit the right people", body: "Get volunteer recommendations matched on skills, interests, and past experience, then invite them directly." },
];

const HowItWorksPage = () => (
  <PageShell
    eyebrow="Simple process"
    title="How Nepal Hands works"
    subtitle="One platform connecting donors, volunteers, and verified organizations across Nepal — with transparency built into every step."
  >
    <ol className="space-y-6">
      {steps.map((s, i) => (
        <li key={s.title} className="flex gap-5">
          <div className="flex flex-col items-center">
            <span className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 text-primary shrink-0">
              <s.icon size={22} />
            </span>
            {i < steps.length - 1 && <span className="flex-1 w-px bg-border mt-2" />}
          </div>
          <div className="pb-2">
            <h2 className="font-display text-lg font-semibold text-foreground">
              {i + 1}. {s.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>

    <h2 className="font-display text-2xl font-bold text-foreground mt-14 mb-5">For donors & volunteers</h2>
    <div className="grid gap-4 sm:grid-cols-2">
      {donors.map((c) => (
        <Card key={c.title}>
          <CardContent className="p-6">
            <c.icon className="text-primary mb-3" size={22} />
            <h3 className="font-semibold text-foreground mb-1">{c.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-5">For organizers</h2>
    <div className="grid gap-4 sm:grid-cols-2">
      {organizers.map((c) => (
        <Card key={c.title}>
          <CardContent className="p-6">
            <c.icon className="text-primary mb-3" size={22} />
            <h3 className="font-semibold text-foreground mb-1">{c.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="mt-14 rounded-2xl bg-muted/60 border border-border p-8 text-center">
      <h2 className="font-display text-xl font-bold text-foreground">Ready to make a difference?</h2>
      <p className="text-sm text-muted-foreground mt-2">Start a campaign or find a cause that needs your hands.</p>
      <div className="flex flex-wrap gap-3 justify-center mt-5">
        <Button asChild><Link to="/organizer/campaign/create">Start a campaign</Link></Button>
        <Button variant="outline" asChild><Link to="/campaigns">Browse campaigns</Link></Button>
        <Button variant="outline" asChild><Link to="/volunteers">Browse Volunteer Opportunities</Link></Button>
      </div>
    </div>
  </PageShell>
);

export default HowItWorksPage;