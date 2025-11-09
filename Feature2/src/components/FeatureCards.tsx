import { Card } from "@/components/ui/card";
import { MapPin, TrendingUp, Users, Trophy, Leaf, Shield } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Live Area Insights",
    description: "Real-time AQI, noise, and traffic data for your location with smart POI recommendations",
    gradient: "from-primary to-primary-glow",
  },
  {
    icon: TrendingUp,
    title: "Traffic Pattern Analysis",
    description: "Understand peak hours, congestion zones, and optimal travel times with ML predictions",
    gradient: "from-secondary to-blue-400",
  },
  {
    icon: Leaf,
    title: "Eco Points & Rewards",
    description: "Earn points for sustainable choices: +50 public transport, +30 carpools, +25 off-peak travel",
    gradient: "from-success to-primary",
  },
  {
    icon: Users,
    title: "Community Feed",
    description: "Share routes, discover eco-zones, and connect with fellow green commuters",
    gradient: "from-warning to-primary-glow",
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    description: "Compete city-wide, track your green score, and unlock exclusive badges",
    gradient: "from-primary to-secondary",
  },
  {
    icon: Shield,
    title: "Expert Mode",
    description: "Advanced heatmaps, raw data exports, and professional analytics for urban planners",
    gradient: "from-secondary to-destructive",
  },
];

const FeatureCards = () => {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Everything You Need for
            <span className="bg-clip-text text-transparent bg-gradient-eco"> Smart Mobility</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dual-mode interface: Simple Citizen View for everyone, Expert Dashboard for professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden hover:shadow-elevated transition-all duration-500 border-border bg-card cursor-pointer"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              <div className="relative p-8 space-y-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-eco transform group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
