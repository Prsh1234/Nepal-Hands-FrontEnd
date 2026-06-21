import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { campaigns } from "@/data/campaigns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search,
  SlidersHorizontal,
  Heart,
  Clock,
  Users,
  CheckCircle,
  Droplets,
  GraduationCap,
  HeartPulse,
  Sprout,
  Home,
  Sparkles,
  ArrowUpDown,
  Leaf,
} from "lucide-react";
import { CampaignCardDTO, getCampaigns } from "@/services/campaignService";
import { formatDate } from "@/lib/utils";

const formatNPR = (n: number) => "NPR " + n.toLocaleString("en-IN");

const categoryIcons: Record<string, React.ReactNode> = {
  "Water & Sanitation": <Droplets size={16} />,
  Education: <GraduationCap size={16} />,
  Health: <HeartPulse size={16} />,
  Environment: <Sprout size={16} />,
  Housing: <Home size={16} />,
  Empowerment: <Sparkles size={16} />,
};
const CATEGORIES = [
  { id: "WATER", label: "Water & Sanitation", icon: Droplets },
  { id: "EDUCATION", label: "Education", icon: GraduationCap },
  { id: "HEALTH", label: "Health", icon: Heart },
  { id: "SHELTER", label: "Shelter & Housing", icon: Home },
  { id: "ENVIRONMENT", label: "Environment", icon: Leaf },
  { id: "EMPOWERMENT", label: "Empowerment", icon: Users },
];


type SortOption = "newest" | "ending-soon";

const sortLabels: Record<SortOption, string> = {
  newest: "Newest",
  "ending-soon": "Ending Soon",
};

const Campaigns = () => {
  const [sort, setSort] = useState<SortOption>("ending-soon");
  const [campaigns, setCampaigns] = useState<CampaignCardDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [size] = useState(9);

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  useEffect(() => {
    loadCampaigns();
  }, [search, activeCategory, sort, page]);



  const loadCampaigns = async () => {
    try {
      setLoading(true);

      const response = await getCampaigns({
        search: search || undefined,
        category: activeCategory || undefined,
        sort,
        page,
        size,
      });

      setCampaigns(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-8 bg-gradient-to-b from-accent/50 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Browse Campaigns
            </h1>
            <p className="text-muted-foreground mt-2">
              Discover verified campaigns making real impact across Nepal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 space-y-3">
          {/* Search + Sort row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search campaigns..."
                value={search}
                onChange={(e) => {
                  setPage(0);
                  setSearch(e.target.value);
                }}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                <Button
                  key={key}
                  variant={sort === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setPage(0);
                    setSort(key);
                  }}
                  className="text-xs"
                >
                  <ArrowUpDown size={14} className="mr-1" />
                  {sortLabels[key]}
                </Button>
              ))}
            </div>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(null)}
              className="text-xs shrink-0"
            >
              <SlidersHorizontal size={14} className="mr-1" /> All
            </Button>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;

              return (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setPage(0);
                    setActiveCategory(
                      activeCategory === cat.id ? null : cat.id
                    );
                  }}
                  className="text-xs shrink-0"
                >
                  <Icon size={14} className="mr-1" />
                  {cat.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
      {(() => {
         if (loading) {
          return <div>Loading...</div>;
        }else{
          return(
            <section className="py-10">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground mb-6">
            {totalElements} campaign{totalElements !== 1 && "s"} found
          </p>

          <AnimatePresence mode="popLayout">
            {campaigns.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Search size={48} className="mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground">No campaigns found</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your search or filters.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {campaigns.map((campaign, i) => (
                  <motion.div
                    key={campaign.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-300 group"
                  >
                    <div className="h-2 bg-gradient-hero" />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-accent px-3 py-1 rounded-full">
                          {categoryIcons[campaign.category]} {campaign.category}
                        </span>

                      </div>

                      <Link to={`/campaign/${campaign.id}`}>
                        <h3 className="font-display text-lg font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors cursor-pointer">
                          {campaign.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-1">by {campaign.organizer}</p>
                      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{campaign.description}</p>

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
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {formatDate(campaign.postedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {campaign.daysLeft} days left
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} /> {campaign.donors} donors
                        </span>
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
            )}
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-10">
            <Button
              variant="outline"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <span className="flex items-center px-4">
              Page {page + 1} of {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>

      </section>
          )
        }
      })()}

      {/* Results */}
      

      <Footer />
    </div>
  );
};

export default Campaigns;
