import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { volunteerOpportunities } from "@/data/volunteers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUpDown,
  Heart,
  GraduationCap,
  Stethoscope,
  Hammer,
  Leaf,
  HandHelping,
  Laptop,
  Baby,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  Teaching: <GraduationCap size={16} />,
  Healthcare: <Stethoscope size={16} />,
  Construction: <Hammer size={16} />,
  Environment: <Leaf size={16} />,
  "Community Service": <HandHelping size={16} />,
  "IT & Digital": <Laptop size={16} />,
  Childcare: <Baby size={16} />,
};

const allCategories = Array.from(new Set(volunteerOpportunities.map((v) => v.category)));

type SortOption = "spots-left" | "newest" | "starting-soon";

const sortLabels: Record<SortOption, string> = {
  "spots-left": "Spots Available",
  newest: "Newest",
  "starting-soon": "Starting Soon",
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const Volunteers = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("starting-soon");

  const filtered = useMemo(() => {
    let result = [...volunteerOpportunities];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.org.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.skills.some((skill) => skill.toLowerCase().includes(q))
      );
    }

    if (activeCategory) {
      result = result.filter((v) => v.category === activeCategory);
    }

    switch (sort) {
      case "spots-left":
        result.sort((a, b) => (b.spots - b.spotsFilled) - (a.spots - a.spotsFilled));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        break;
      case "starting-soon":
        result.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        break;
    }

    return result;
  }, [search, activeCategory, sort]);

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
              Volunteer Opportunities
            </h1>
            <p className="text-muted-foreground mt-2">
              Find meaningful ways to contribute your skills to verified organizations across Nepal.
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
                placeholder="Search opportunities, skills, locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                <Button
                  key={key}
                  variant={sort === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSort(key)}
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
            {allCategories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className="text-xs shrink-0"
              >
                {categoryIcons[cat]} {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground mb-6">
            {filtered.length} opportunity{filtered.length !== 1 && "s"} found
          </p>

          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Search size={48} className="mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground">No opportunities found</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your search or filters.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((volunteer, i) => {
                  const spotsLeft = volunteer.spots - volunteer.spotsFilled;
                  const fillPercentage = (volunteer.spotsFilled / volunteer.spots) * 100;

                  return (
                    <motion.div
                      key={volunteer.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-300 group flex flex-col"
                    >
                      <div className="h-2 bg-gradient-hero" />
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-3">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-accent px-3 py-1 rounded-full">
                            {categoryIcons[volunteer.category]} {volunteer.category}
                          </span>
                          <div className="flex items-center gap-2">
                            {volunteer.urgent && (
                              <span className="flex items-center gap-1 text-xs text-destructive font-medium">
                                <AlertCircle size={14} /> Urgent
                              </span>
                            )}
                            {volunteer.verified && (
                              <span className="flex items-center gap-1 text-xs text-secondary font-medium">
                                <CheckCircle size={14} /> Verified
                              </span>
                            )}
                          </div>
                        </div>

                        <Link to={`/volunteer/${volunteer.id}`}>
                          <h3 className="font-display text-lg font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors cursor-pointer">
                            {volunteer.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-1">by {volunteer.org}</p>
                        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{volunteer.description}</p>

                        {/* Progress bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-medium text-foreground">{volunteer.spotsFilled} of {volunteer.spots} volunteers</span>
                            <span className="text-muted-foreground">{spotsLeft} spots left</span>
                          </div>
                          <Progress value={fillPercentage} className="h-2" />
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {volunteer.skills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {volunteer.skills.length > 4 && (
                            <span className="text-xs text-muted-foreground px-1">
                              +{volunteer.skills.length - 4} more
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex flex-col gap-2 text-xs text-muted-foreground border-t border-border pt-4 mt-auto">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} /> {volunteer.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} /> {formatDate(volunteer.startDate)} – {formatDate(volunteer.endDate)}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Clock size={14} /> {volunteer.hoursPerDay} hrs/day
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={14} /> {volunteer.commitment}
                            </span>
                          </div>
                        </div>

                        <Link to={`/volunteer/${volunteer.id}`}>
                          <Button className="w-full mt-4 gap-2" size="sm">
                            <Heart size={16} /> Apply Now
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Volunteers;
