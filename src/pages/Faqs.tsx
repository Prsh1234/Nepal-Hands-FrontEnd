import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PageShell from "@/components/PageShell";
import { Search } from "lucide-react";

const faqGroups = [
  {
    group: "Donations",
    items: [
      { q: "How do I donate?", a: "Open any campaign, choose a preset amount or enter your own in NPR, and pay securely with eSewa. You can donate anonymously if you prefer." },
      { q: "Can I get a refund?", a: "Donations are generally final. If a campaign is found fraudulent or is cancelled before funds are released, contact us within 30 days and we will review your case." },
      { q: "How do I know my money is used properly?", a: "Every campaign has a Transparency tab with a public expense ledger, receipts, milestone progress, and proof-of-impact uploads." },
    ],
  },
  {
    group: "Volunteering",
    items: [
      { q: "How do I join a volunteer activity?", a: "Browse opportunities, open one that matches your skills, and apply. The organizer reviews applications and confirms your spot on the roster." },
      { q: "What are invitations?", a: "Organizers can invite volunteers whose skills and interests match their opportunity. Invitations appear under My Invitations, where you can accept or decline with a note." },
      { q: "Do I need experience?", a: "Many opportunities are open to first-time volunteers. Each listing lists required skills, eligibility, and what you will do." },
    ],
  },
  {
    group: "Campaigns & organizers",
    items: [
      { q: "Who can create a campaign?", a: "Individuals and registered organizations can apply. You must complete KYC and submit proof of authenticity — registration certificate, PAN/VAT, and signatory details." },
      { q: "How long does approval take?", a: "Most submissions are reviewed within 2–3 business days. You will be notified once a decision is made." },
      { q: "When do I receive funds?", a: "Payouts are requested from the organizer dashboard and released to the verified bank account on file after the review of supporting documents." },
    ],
  },
  {
    group: "Account & security",
    items: [
      { q: "Why do I need KYC?", a: "KYC protects donors from fraud. We collect citizenship or PAN details, address, and a selfie, stored privately and visible only to our verification team." },
      { q: "I forgot my password.", a: "Use the “Forgot your password?” link on the sign-in page. We will email you a secure reset link." },
    ],
  },
];

const Faqs = () => {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = faqGroups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => !q || i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q)),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <PageShell
      eyebrow="Help centre"
      title="Frequently asked questions"
      subtitle="Answers about donating, volunteering, running campaigns, and keeping your account secure."
    >
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions…"
          className="pl-9"
          aria-label="Search frequently asked questions"
        />
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">No questions match “{query}”.</p>
      )}

      {filtered.map((g) => (
        <div key={g.group} className="mb-8">
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">{g.group}</h2>
          <Accordion type="single" collapsible className="w-full">
            {g.items.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="text-left text-sm font-medium">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}


    </PageShell>
  );
};

export default Faqs;