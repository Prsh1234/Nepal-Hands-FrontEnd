import logo from "@/assets/nepal-hands-logo.png";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Nepal Hands" className="h-10 w-10" loading="lazy" />
              <span className="font-display text-xl font-bold">
                Nepal Hands
              </span>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              A unified platform for crowdfunding and volunteer recruitment — building trust, transparency, and social impact across Nepal.
            </p>
          </div>

          {[
            {
              title: "Platform",
              links: [
                { label: "Browse Campaigns", to: "/campaigns" },
                { label: "Browse Volunteer Opportuninites", to: "/volunteers" },
                { label: "Create Campaign", to: "/organizer/campaign/create" },
                { label: "Create Volunteer Opportuninites", to: "/organizer/volunteer/create" },

              ],
            },
            {
              title: "Resources",
              links: [
                { label: "How It Works", to: "/how-it-works" },
                { label: "FAQs", to: "/faqs" },
                { label: "About", to: "/about" },
                { label: "Support Us", to: "/support" },

              ],
            },
            {
              title: "Legal",
              links: [
                { label: "Privacy Policy", to: "/privacy" },
                { label: "Terms of Service", to: "/terms" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-sm mb-4 uppercase tracking-wider text-background/80">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                  <Link to={link.to} className="text-sm text-background/50 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/40">
            © 2026 Nepal Hands. All rights reserved.
          </p>
          <p className="text-sm text-background/40 flex items-center gap-1">
            Made with <Heart size={14} className="text-primary" /> for Nepal
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
