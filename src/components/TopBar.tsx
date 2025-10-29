import { Waves, Circle } from "lucide-react";
import { useEffect, useState } from "react";

interface TopBarProps {
  isRunning: boolean;
}

const TopBar = ({ isRunning }: TopBarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-card border-b border-primary/20 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left - Project Name */}
        <div className="flex items-center gap-3">
          <Waves className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-semibold font-poppins">
            Smart Aquaculture System
          </h1>
        </div>

        {/* Center - Status */}
        <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-full">
          <Circle
            className={`w-3 h-3 fill-current ${
              isRunning ? "text-success animate-pulse" : "text-muted-foreground"
            }`}
          />
          <span className="text-sm font-medium font-inter">
            {isRunning ? "Simulation Running" : "Paused"}
          </span>
        </div>

        {/* Right - Date & Time */}
        <div className="text-sm text-muted-foreground font-inter">
          <div>{currentTime.toLocaleDateString()}</div>
          <div className="text-primary font-medium">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
