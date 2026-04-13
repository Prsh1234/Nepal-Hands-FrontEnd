import { motion } from "framer-motion";
import { UserPlus, Search, Heart, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up as a donor, volunteer, or campaign creator in seconds.",
  },
  {
    icon: Search,
    title: "Discover & Connect",
    description: "Browse verified campaigns or find volunteer opportunities matched to your skills.",
  },
  {
    icon: Heart,
    title: "Contribute",
    description: "Donate securely via eSewa/Khalti or sign up to volunteer for causes you care about.",
  },
  {
    icon: BarChart3,
    title: "Track Impact",
    description: "See real-time transparency reports showing exactly how your contribution makes a difference.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
            How Nepal Hands Works
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            From signing up to tracking your impact — making a difference has never been easier.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px border-t-2 border-dashed border-border" />
              )}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary mb-6">
                <step.icon size={32} />
              </div>
              <div className="absolute -top-2 -right-2 md:static md:mb-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
