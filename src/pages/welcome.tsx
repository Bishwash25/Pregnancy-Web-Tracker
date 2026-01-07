import React from "react";
import { HeroSection } from "../ui/welcome/HeroSection";
import { FeaturesSection } from "../ui/welcome/FeaturesSection";
import { CallToActionSection } from "../ui/welcome/CallToActionSection";
import { Footer } from "../ui/welcome/Footer";

const Welcome: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50/30 font-sans overflow-hidden relative">
      <HeroSection />
      <FeaturesSection />
      <CallToActionSection />
      <Footer />
    </div>
  );
};

export default Welcome;
