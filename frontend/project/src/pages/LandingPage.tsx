import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import StatsSection from "../components/StatsSection";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
