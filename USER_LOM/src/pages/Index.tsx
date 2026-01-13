import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureStoreSection from '@/components/FeatureStoreSection';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeatureStoreSection />
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
};

export default Index;
