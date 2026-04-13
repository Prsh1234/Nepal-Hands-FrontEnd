import logo from "@/assets/nepal-hands-logo.png";
import { Heart } from "lucide-react";

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
              links: ["Browse Campaigns", "Volunteer", "Create Campaign", "Transparency Reports"],
            },
            {
              title: "Resources",
              links: ["How It Works", "FAQs", "Blog", "Contact Us"],
            },
            {
              title: "Legal",
              links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-sm mb-4 uppercase tracking-wider text-background/80">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-background/50 hover:text-background transition-colors">
                      {link}
                    </a>
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
