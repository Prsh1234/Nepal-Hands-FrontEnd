import { Card, CardContent } from "@/components/ui/card";
import PageShell from "@/components/PageShell";
import {
  HeartHandshake,
  Users,
  ShieldCheck,
  Globe2,
  Target,
  HandHeart,
  Landmark,
  Sparkles,
} from "lucide-react";

const mission = [
  {
    icon: HeartHandshake,
    title: "Connecting people with purpose",
    body: "Nepal Hands bridges the gap between people who want to help and communities that need support by bringing donors, volunteers, and organizations together.",
  },
  {
    icon: ShieldCheck,
    title: "Building trust through transparency",
    body: "Every campaign follows verification processes and provides transparent updates so supporters can understand the impact of their contributions.",
  },
  {
    icon: Users,
    title: "Empowering communities",
    body: "We help local organizations and individuals mobilize resources, recruit volunteers, and create meaningful social change.",
  },
];

const values = [
  {
    icon: Target,
    title: "Impact-driven",
    body: "We focus on creating measurable improvements for communities through effective fundraising and volunteering.",
  },
  {
    icon: Globe2,
    title: "Inclusive platform",
    body: "Anyone can contribute their time, skills, or resources toward causes that matter to them.",
  },
  {
    icon: Landmark,
    title: "Accountability first",
    body: "Verification, reporting, and transparent records ensure responsible use of donations.",
  },
  {
    icon: Sparkles,
    title: "Technology for good",
    body: "We use digital tools to make social contribution simpler, faster, and more accessible.",
  },
];

const AboutPage = () => (
  <PageShell
    eyebrow="About Nepal Hands"
    title="Connecting kindness with communities"
    subtitle="Nepal Hands is a crowdfunding and volunteer recruitment platform designed to make social impact more accessible, transparent, and meaningful across Nepal."
  >
    <section>
      <h2 className="font-display text-2xl font-bold text-foreground mb-5">
        Our mission
      </h2>

      <div className="grid gap-4 sm:grid-cols-3">
        {mission.map((item) => (
          <Card key={item.title}>
            <CardContent className="p-6">
              <item.icon className="text-primary mb-3" size={24} />

              <h3 className="font-semibold text-foreground mb-2">
                {item.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

    <section className="mt-14">
      <h2 className="font-display text-2xl font-bold text-foreground mb-5">
        What we do
      </h2>

      <div className="rounded-2xl bg-muted/60 border border-border p-8">
        <p className="text-muted-foreground leading-relaxed">
          Nepal Hands provides a centralized platform where individuals,
          nonprofits, and communities can create campaigns, collect donations,
          discover volunteer opportunities, and track the progress of social
          initiatives.
          <br />
          <br />
          By combining crowdfunding, volunteer matching, identity verification,
          and impact reporting, the platform aims to create a safer and more
          effective way for people to contribute toward meaningful causes.
        </p>
      </div>
    </section>

    <section className="mt-14">
      <h2 className="font-display text-2xl font-bold text-foreground mb-5">
        Our core values
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {values.map((item) => (
          <Card key={item.title}>
            <CardContent className="p-6">
              <item.icon className="text-primary mb-3" size={22} />

              <h3 className="font-semibold text-foreground mb-1">
                {item.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

    <section className="mt-14">
      <div className="rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center">
        <HandHeart
          className="mx-auto text-primary mb-4"
          size={32}
        />

        <h2 className="font-display text-xl font-bold text-foreground">
          Together, we can create lasting change
        </h2>

        <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
          Whether you donate, volunteer, or organize a campaign, every action
          contributes to building stronger and more connected communities.
        </p>
      </div>
    </section>
  </PageShell>
);

export default AboutPage;