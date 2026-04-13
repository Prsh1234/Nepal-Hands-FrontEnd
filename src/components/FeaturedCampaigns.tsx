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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign, i) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-300 group"
            >
              <div className="h-2 bg-gradient-hero" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-primary bg-accent px-3 py-1 rounded-full">
                    {campaign.category}
                  </span>
                  {campaign.verified && (
                    <span className="flex items-center gap-1 text-xs text-nepal-blue font-medium">
                      <CheckCircle size={14} /> Verified
                    </span>
                  )}
                </div>

                <Link to={`/campaign/${campaign.id}`}>
                  <h3 className="font-display text-lg font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors cursor-pointer">
                    {campaign.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mb-4">by {campaign.org}</p>

                <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-hero rounded-full transition-all duration-700"
                    style={{ width: `${campaign.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="font-semibold text-foreground">{formatNPR(campaign.raised)}</span>
                  <span className="text-muted-foreground">of {formatNPR(campaign.goal)}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
                  <span className="flex items-center gap-1"><Clock size={14} /> {campaign.daysLeft} days left</span>
                  <span className="flex items-center gap-1"><Users size={14} /> {campaign.donors} donors</span>
                </div>

                <Link to={`/campaign/${campaign.id}`}>
                  <Button className="w-full mt-4 gap-2" size="sm">
                    <Heart size={16} /> Donate Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">View All Campaigns</Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCampaigns;
