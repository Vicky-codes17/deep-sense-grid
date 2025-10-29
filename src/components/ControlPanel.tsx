import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Download, Settings } from "lucide-react";
import { TankData } from "@/types/aquaculture";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

interface ControlPanelProps {
  isRunning: boolean;
  onPause: () => void;
  onReset: () => void;
  onExport: () => void;
  selectedTank: TankData;
}

const ControlPanel = ({ isRunning, onPause, onReset, onExport, selectedTank }: ControlPanelProps) => {
  const [feedRate, setFeedRate] = useState([selectedTank.feedRate]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const healthScore = useMemo(() => {
    // Basic heuristic scoring based on key parameters
    let score = 100;
    const temp = selectedTank.temperature ?? 0;
    const pH = selectedTank.pH ?? 7;
    const oxygen = selectedTank.oxygen ?? 0;
    const ammonia = selectedTank.ammonia ?? 0;
    const nitrate = (selectedTank as any).nitrate ?? 0;

    // Temperature penalty (optimal window ~26 - 30)
    if (temp < 26) score -= Math.min(20, Math.round((26 - temp) * 5));
    if (temp > 30) score -= Math.min(20, Math.round((temp - 30) * 5));

    // pH penalty (optimal ~6.8 - 7.8)
    if (pH < 6.8) score -= Math.min(15, Math.round((6.8 - pH) * 20));
    if (pH > 7.8) score -= Math.min(15, Math.round((pH - 7.8) * 20));

    // Oxygen penalty
    if (oxygen < (selectedTank.minOxygen ?? 5)) score -= 25;
    else if (oxygen < (selectedTank.minOxygen ?? 5) + 1) score -= 10;

    // Ammonia penalty (higher is worse)
    if (ammonia > (selectedTank.maxAmmonia ?? 0.03)) {
      const over = ammonia / (selectedTank.maxAmmonia ?? 0.03);
      score -= Math.min(40, Math.round(20 * over));
    }

    // Nitrate minor penalty
    if (nitrate > 30) score -= 5;

    score = Math.max(0, Math.min(100, Math.round(score)));
    return score;
  }, [selectedTank]);

  const healthMessage = useMemo(() => {
    if (healthScore >= 80) return "All parameters within acceptable range";
    if (healthScore >= 60) return "Minor issues detected — monitor closely";
    return "Attention required — check water parameters";
  }, [healthScore]);

  const handleSaveFeedRate = () => {
    // In a real app, this would update the tank's feed rate
    console.log("Feed rate updated to:", feedRate[0]);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
  <h3 className="text-lg font-semibold font-poppins">System Controls</h3>

      {/* Main Controls */}
      <div className="space-y-3">
        <Button
          onClick={onPause}
          className="w-full glass-card-hover border border-primary/30"
          size="lg"
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause Simulation
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Resume Simulation
            </>
          )}
        </Button>

        <Button
          onClick={onReset}
          variant="outline"
          className="w-full glass-card-hover border border-destructive/30 text-destructive hover:text-destructive-foreground hover:bg-destructive"
          size="lg"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset Simulation
        </Button>
      </div>

      {/* Feed Rate Control */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full glass-card-hover border border-primary/30"
            size="lg"
          >
            <Settings className="w-5 h-5 mr-2" />
            Change Feed Rate
          </Button>
        </DialogTrigger>
        <DialogContent className="glass-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="font-poppins text-xl">Adjust Feed Rate</DialogTitle>
            <DialogDescription className="font-inter">
              Modify the feeding rate for {selectedTank.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="mb-4 text-center">
              <div className="text-4xl font-bold text-primary font-poppins">
                {feedRate[0]}%
              </div>
              <div className="text-sm text-muted-foreground">Feed Rate</div>
            </div>
            <Slider
              value={feedRate}
              onValueChange={setFeedRate}
              min={50}
              max={150}
              step={5}
              className="mb-6"
            />
            <Button
              onClick={handleSaveFeedRate}
              className="w-full"
              size="lg"
            >
              Apply Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Data */}
      <Button
        onClick={onExport}
        variant="outline"
        className="w-full glass-card-hover border border-accent/30"
        size="lg"
      >
        <Download className="w-5 h-5 mr-2" />
        Export Data (CSV)
      </Button>

      {/* Tank Health Score */}
      <div className="glass-card p-6 rounded-xl text-center">
        <div className="text-sm text-muted-foreground mb-2 font-poppins">
          Tank Health Score
        </div>
        <div className="relative w-32 h-32 mx-auto">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="hsl(200, 50%, 20%)"
              strokeWidth="8"
              fill="transparent"
            />
            {/* dynamic arc based on healthScore */}
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="hsl(142, 76%, 36%)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 56 * (healthScore / 100)} ${2 * Math.PI * 56}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl font-bold text-success font-poppins">{healthScore}%</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          {healthMessage}
        </div>
      </div>

      {/* Mini Fish Tank Visual */}
      <div className="glass-card p-4 rounded-xl relative overflow-hidden h-32">
        <div className="absolute inset-0 flex items-end justify-center">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bubble"
              style={{
                left: `${20 + i * 10}%`,
                width: "8px",
                height: "8px",
                animationDuration: `${2 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        <div className="text-center text-sm text-muted-foreground relative z-10">
          🐠 Tank Environment Active
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
