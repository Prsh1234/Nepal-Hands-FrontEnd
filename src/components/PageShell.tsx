import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PageShellProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
}

const PageShell = ({ title, subtitle, eyebrow, children }: PageShellProps) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <header className="pt-28 pb-12 bg-muted/50 border-b border-border">
      <div className="container mx-auto px-4 max-w-4xl">
        {eyebrow && (
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground mt-4 leading-relaxed">{subtitle}</p>
        )}
      </div>
    </header>
    <main className="py-14">
      <div className="container mx-auto px-4 max-w-4xl">{children}</div>
    </main>
    <Footer />
  </div>
);

export default PageShell;

export const LegalSection = ({ heading, children }: { heading: string; children: ReactNode }) => (
  <section className="mb-10">
    <h2 className="font-display text-xl font-semibold text-foreground mb-3">{heading}</h2>
    <div className="text-sm text-muted-foreground leading-relaxed space-y-3">{children}</div>
  </section>
);