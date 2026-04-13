import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Tag, ArrowRight, Plus } from "lucide-react";

const opportunities = [
  {
    title: "Teaching English in Rural Schools",
    location: "Gorkha District",
    date: "Jul 15 – Aug 15, 2026",
    skills: ["Teaching", "English"],
    spots: 8,
  },
  {
    title: "Community Health Camp Support",
    location: "Kathmandu Valley",
    date: "Aug 1 – Aug 5, 2026",
    skills: ["Healthcare", "First Aid"],
    spots: 15,
  },
  {
    title: "Trail Restoration & Cleanup",
    location: "Annapurna Region",
    date: "Sep 10 – Sep 20, 2026",
    skills: ["Physical Fitness", "Outdoors"],
    spots: 20,
  },
];

const VolunteerSection = () => {
  return (
    <section id="volunteer" className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Volunteer
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Lend Your Skills Where They Matter Most
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our intelligent matching system connects you with volunteer
              opportunities that align with your skills, interests, and
              availability. Every opportunity is posted by verified organizations.
            </p>
            <Button size="lg" className="gap-2">
              Browse All Opportunities <ArrowRight size={18} />
            </Button>
          </motion.div>

          <div className="space-y-4">
            {opportunities.map((opp, i) => (
              <motion.div
                key={opp.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="p-5 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-card transition-all group cursor-pointer"
              >
                <h3 className="font-display font-semibold text-card-foreground group-hover:text-primary transition-colors mb-3">
                  {opp.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {opp.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {opp.date}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {opp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full"
                      >
                        <Tag size={10} /> {skill}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {opp.spots} spots left
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VolunteerSection;
