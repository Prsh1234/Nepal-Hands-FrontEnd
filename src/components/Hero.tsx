import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import heroImage from "@/assets/hero-nepal.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Nepal community"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 mb-6">
              <Shield size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary-foreground/90">
                Admin-Verified Campaigns
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-primary-foreground">Empowering</span>{" "}
              <span className="text-primary">Nepal</span>{" "}
              <span className="text-primary-foreground">Through Unity</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/70 leading-relaxed mb-8 max-w-xl">
              A unified platform for crowdfunding and volunteer recruitment — bringing
              transparency, trust, and social impact to every community initiative.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base px-8 gap-2">
                Start a Campaign <ArrowRight size={18} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 gap-2"
              >
                Explore Campaigns
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
