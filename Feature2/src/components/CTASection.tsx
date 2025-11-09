import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 px-4 bg-gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Join 10,000+ eco-conscious citizens</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Ready to Make a
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-glow via-white to-white">
              Greener Impact?
            </span>
          </h2>

          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Start tracking your eco-footprint, discover cleaner routes, and earn rewards for sustainable choices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="hero" size="lg" className="gap-2 text-lg">
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline-hero" size="lg" className="text-lg">
              Watch Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-white/80">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50K+</div>
              <div className="text-sm">Green Trips</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">2.5M</div>
              <div className="text-sm">CO₂ Saved (kg)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">150+</div>
              <div className="text-sm">Cities Mapped</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
