import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Clock, Users, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { campaigns } from "@/data/campaigns";

const formatNPR = (n: number) => "NPR " + n.toLocaleString("en-IN");

const FeaturedCampaigns = () => {
  return (
    <section id="campaigns" className="py-24 bg-warm">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Featured Campaigns
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
            Make a Difference Today
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Every campaign is verified by our admin team to ensure authenticity, transparency, and real impact.
          </p>
        </motion.div>

        

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild><Link to="/campaigns">View All Campaigns</Link></Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCampaigns;
