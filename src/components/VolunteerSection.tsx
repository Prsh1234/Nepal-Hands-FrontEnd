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
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"> */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
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

            <div className="text-center mt-12">
              <Button size="lg" className="gap-2" asChild>
                <Link to="/volunteers">
                  Browse All Opportunities <ArrowRight size={18} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link to="/organizer/volunteer/create">
                  <Plus size={18} /> Post Opportunity
                </Link>
              </Button>
            </div>
        </motion.div>


      </div>
      {/* </div> */}
    </section>
  );
};

export default VolunteerSection;
