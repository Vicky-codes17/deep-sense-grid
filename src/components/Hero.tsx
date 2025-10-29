import { Button } from "@/components/ui/button";
import { Waves } from "lucide-react";

interface HeroProps {
  onStart: () => void;
}

const Hero = ({ onStart }: HeroProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated bubbles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 60}px`,
              height: `${20 + Math.random() * 60}px`,
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-8 inline-flex items-center gap-3">
          <Waves className="w-16 h-16 text-primary animate-pulse" />
          <h1 className="text-7xl font-bold font-poppins glow-text">
            Smart Aquaculture
          </h1>
        </div>
        
        <h2 className="text-5xl font-bold font-poppins mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Monitoring System
        </h2>

        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-inter">
          Simulate and visualize real-time aquaculture environment based on your inputs.
          Monitor water quality, optimize feeding, and ensure healthy fish growth.
        </p>

        <Button
          onClick={onStart}
          size="lg"
          className="group relative px-12 py-8 text-xl font-semibold font-poppins rounded-2xl bg-gradient-to-r from-primary to-accent hover:shadow-[0_0_40px_rgba(0,194,203,0.6)] transition-all duration-300 transform hover:scale-105"
        >
          <span className="relative z-10 flex items-center gap-3">
            <Waves className="w-6 h-6 group-hover:animate-pulse" />
            Start Simulation
          </span>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
        </Button>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {[
            { label: "Real-Time Monitoring", value: "24/7" },
            { label: "Data Points", value: "1000+" },
            { label: "Accuracy", value: "99.8%" },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 rounded-xl">
              <div className="text-3xl font-bold text-primary mb-2 font-poppins">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-inter">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
