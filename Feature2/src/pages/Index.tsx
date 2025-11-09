import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import CTASection from "@/components/CTASection";
import ModeToggle from "@/components/ModeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ModeToggle />
      <main>
        <Hero />
        <FeatureCards />
        <CTASection />
      </main>
    </div>
  );
};

export default Index;
