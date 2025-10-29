import { TankData } from "@/types/aquaculture";
import { Thermometer, Droplet, Wind, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ParametersPanelProps {
  tanks: TankData[];
  selectedTankId: string;
  onSelectTank: (id: string) => void;
}

const ParametersPanel = ({ tanks, selectedTankId, onSelectTank }: ParametersPanelProps) => {
  const selectedTank = tanks.find(t => t.id === selectedTankId);

  if (!selectedTank) return null;

  const getStatusColor = (value: number, min: number, max: number, optimal: number) => {
    if (value < min || value > max) return "status-danger";
    if (Math.abs(value - optimal) > (max - min) * 0.3) return "status-warning";
    return "status-safe";
  };

  const parameters = [
    {
      icon: Thermometer,
      label: "Temperature",
      value: selectedTank.temperature.toFixed(1),
      unit: "°C",
      status: getStatusColor(
        selectedTank.temperature,
        selectedTank.optimalTemp - 3,
        selectedTank.optimalTemp + 3,
        selectedTank.optimalTemp
      ),
    },
    {
      icon: Droplet,
      label: "pH Level",
      value: selectedTank.pH.toFixed(1),
      unit: "",
      status: getStatusColor(
        selectedTank.pH,
        selectedTank.optimalPH - 0.5,
        selectedTank.optimalPH + 0.5,
        selectedTank.optimalPH
      ),
    },
    {
      icon: Wind,
      label: "Dissolved Oxygen",
      value: selectedTank.oxygen.toFixed(1),
      unit: "mg/L",
      status: selectedTank.oxygen < selectedTank.minOxygen
        ? "status-danger"
        : selectedTank.oxygen < selectedTank.minOxygen + 1
        ? "status-warning"
        : "status-safe",
    },
    {
      icon: AlertTriangle,
      label: "Ammonia",
      value: selectedTank.ammonia.toFixed(2),
      unit: "ppm",
      status: selectedTank.ammonia > selectedTank.maxAmmonia
        ? "status-danger"
        : selectedTank.ammonia > selectedTank.maxAmmonia * 0.7
        ? "status-warning"
        : "status-safe",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Tank Selector */}
      <div className="glass-card p-4 rounded-xl">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 font-poppins">
          Select Tank
        </h3>
        <Select value={selectedTankId} onValueChange={onSelectTank}>
          <SelectTrigger className="glass-card-hover border-primary/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass-card border-primary/30">
            {tanks.slice(0, 50).map((tank) => (
              <SelectItem key={tank.id} value={tank.id}>
                {tank.name || tank.id}
                <span className="text-xs text-muted-foreground ml-2">· {tank.fishCount ?? "n/a"} fish</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-3 text-sm text-muted-foreground">
          <div>Tank: <span className="text-foreground">{selectedTank.name ?? selectedTank.id}</span></div>
          <div>Fish Count: <span className="text-foreground">{selectedTank.fishCount}</span></div>
          <div>Avg Weight: <span className="text-foreground">{selectedTank.avgWeight} g</span></div>
          <div>Feed Amount: <span className="text-foreground">{(selectedTank as any).feedAmount ?? '—'} g/day</span></div>
          <div>Growth Rate: <span className="text-foreground">{((selectedTank as any).growthRate != null) ? `${(selectedTank as any).growthRate}%` : '—'}</span></div>
          <div>Status: <span className="text-foreground">{((selectedTank as any).healthStatus) ?? '—'}</span></div>
        </div>
      </div>

      {/* Live Parameters */}
      <div className="space-y-3">
  <h3 className="text-lg font-semibold font-poppins">Live Parameters</h3>
        {parameters.map((param, i) => (
          <div
            key={i}
            className="glass-card-hover p-4 rounded-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <param.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-inter">
                    {param.label}
                  </div>
                  <div className="text-2xl font-bold font-poppins">
                    {param.value}
                    <span className="text-sm text-muted-foreground ml-1">
                      {param.unit}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${param.status} shadow-lg`} />
            </div>
          </div>
        ))}
      </div>

      {/* Feed Info */}
      <div className="glass-card p-4 rounded-xl">
        <div className="text-sm text-muted-foreground mb-2 font-poppins">
          Feed Cycle
        </div>
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            selectedTank.feedCycle === "Auto" 
              ? "bg-success/20 text-success" 
              : "bg-warning/20 text-warning"
          }`}>
            {selectedTank.feedCycle}
          </span>
          <span className="text-foreground font-medium">
            {selectedTank.feedRate}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ParametersPanel;
