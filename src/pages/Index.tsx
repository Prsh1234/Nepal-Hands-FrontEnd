import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedCampaigns from "@/components/FeaturedCampaigns";
import VolunteerSection from "@/components/VolunteerSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedCampaigns />
      <VolunteerSection />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
