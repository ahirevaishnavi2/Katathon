import { Button } from "@/components/ui/button";
import { MapPin, Wind, Volume2, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-glow rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Live Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 backdrop-blur-md border border-white/20 text-white">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium">AQI is Healthy — Best time for a walk!</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Smart Mobility.
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-glow to-white">
                Cleaner Future.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Real-time insights on traffic, air quality, and noise levels. Make eco-friendly choices and earn rewards.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="gap-2" onClick={() => navigate('/map')}>
              <Navigation className="w-5 h-5" />
              Plan Green Route
            </Button>
            <Button variant="outline-hero" size="lg" className="gap-2" onClick={() => navigate('/map')}>
              <MapPin className="w-5 h-5" />
              Explore Map
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8">
            <div className="bg-background/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-background/15 transition-all duration-300">
              <Wind className="w-8 h-8 text-success mb-2 mx-auto" />
              <div className="text-3xl font-bold text-white">42</div>
              <div className="text-white/80 text-sm">AQI Good</div>
            </div>
            <div className="bg-background/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-background/15 transition-all duration-300">
              <Volume2 className="w-8 h-8 text-warning mb-2 mx-auto" />
              <div className="text-3xl font-bold text-white">58 dB</div>
              <div className="text-white/80 text-sm">Noise Level</div>
            </div>
            <div className="bg-background/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-background/15 transition-all duration-300">
              <Navigation className="w-8 h-8 text-primary-glow mb-2 mx-auto" />
              <div className="text-3xl font-bold text-white">Light</div>
              <div className="text-white/80 text-sm">Traffic Flow</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
