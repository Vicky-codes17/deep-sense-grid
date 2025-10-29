import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import ParametersPanel from "./ParametersPanel";
import GraphsPanel from "./GraphsPanel";
import ControlPanel from "./ControlPanel";
import InsightsPanel from "./InsightsPanel";
import { TankData, DataPoint, Insight } from "@/types/aquaculture";

interface DashboardProps {
  tanks: TankData[];
  isRunning: boolean;
  onPause: () => void;
  onReset: () => void;
  onExport: () => void;
}

const Dashboard = ({ tanks, isRunning, onPause, onReset, onExport }: DashboardProps) => {
  const [selectedTankId, setSelectedTankId] = useState<string>(tanks[0]?.id || "");
  // keep per-tank time series so switching tanks preserves their history
  const [timeSeriesByTank, setTimeSeriesByTank] = useState<Record<string, {
    temperature: DataPoint[];
    pH: DataPoint[];
    oxygen: DataPoint[];
  }>>({});
  const [insights, setInsights] = useState<Insight[]>([]);

  const selectedTank = tanks.find(t => t.id === selectedTankId) || tanks[0];

  // when tanks list changes, ensure we have entries for them (preserve existing history)
  useEffect(() => {
    const now = Date.now();
    setTimeSeriesByTank(prev => {
      const next = { ...prev };
      tanks.forEach(t => {
        if (!next[t.id]) {
          next[t.id] = {
            temperature: [{ time: now, value: t.temperature }],
            pH: [{ time: now, value: t.pH }],
            oxygen: [{ time: now, value: t.oxygen }],
          };
        }
      });
      return next;
    });

    // Generate initial insights for currently selected tank
    if (selectedTank) updateInsights(selectedTank);
  }, [tanks, selectedTankId]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const now = Date.now();

      // Append each tank's current measurements to its history
      setTimeSeriesByTank(prev => {
        const next: typeof prev = { ...prev };
        tanks.forEach(t => {
          const existing = next[t.id] || { temperature: [], pH: [], oxygen: [] };
          next[t.id] = {
            temperature: [...(existing.temperature || []).slice(-29), { time: now, value: t.temperature }],
            pH: [...(existing.pH || []).slice(-29), { time: now, value: t.pH }],
            oxygen: [...(existing.oxygen || []).slice(-29), { time: now, value: t.oxygen }],
          };
        });
        return next;
      });

      // update insights for currently selected tank id
      const tankNow = tanks.find(tt => tt.id === selectedTankId) || tanks[0];
      if (tankNow) updateInsights(tankNow);
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, tanks, selectedTankId]);

  const updateInsights = (tank: TankData) => {
    const newInsights: Insight[] = [];

    // Oxygen check
    if (tank.oxygen < tank.minOxygen) {
      newInsights.push({
        type: "danger",
        message: `🚨 Oxygen level critically low (${tank.oxygen.toFixed(1)} mg/L) — activate aerator immediately!`,
      });
    } else if (tank.oxygen < tank.minOxygen + 1) {
      newInsights.push({
        type: "warning",
        message: `⚠️ Oxygen dropping (${tank.oxygen.toFixed(1)} mg/L) — monitor closely.`,
      });
    } else {
      newInsights.push({
        type: "success",
        message: `✓ Oxygen level stable (${tank.oxygen.toFixed(1)} mg/L) — conditions optimal.`,
      });
    }

    // Temperature check
    const tempDiff = Math.abs(tank.temperature - tank.optimalTemp);
    if (tempDiff > 3) {
      newInsights.push({
        type: "danger",
        message: `🌡️ Temperature ${tank.temperature > tank.optimalTemp ? 'too high' : 'too low'} (${tank.temperature.toFixed(1)}°C) for ${tank.species}!`,
      });
    } else if (tempDiff > 1.5) {
      newInsights.push({
        type: "warning",
        message: `🌡️ Temperature drifting (${tank.temperature.toFixed(1)}°C) — adjust heating/cooling.`,
      });
    } else {
      newInsights.push({
        type: "success",
        message: `✓ Temperature ideal (${tank.temperature.toFixed(1)}°C) for ${tank.species} growth.`,
      });
    }

    // Ammonia check
    if (tank.ammonia > tank.maxAmmonia) {
      newInsights.push({
        type: "danger",
        message: `☠️ Ammonia levels toxic (${tank.ammonia.toFixed(2)} ppm) — increase biofilter capacity!`,
      });
    } else if (tank.ammonia > tank.maxAmmonia * 0.7) {
      newInsights.push({
        type: "warning",
        message: `⚠️ Ammonia rising (${tank.ammonia.toFixed(2)} ppm) — check biofilter.`,
      });
    }

    // pH check
    const pHDiff = Math.abs(tank.pH - tank.optimalPH);
    if (pHDiff > 0.5) {
      newInsights.push({
        type: "warning",
        message: `⚗️ pH imbalance (${tank.pH.toFixed(1)}) — consider buffering.`,
      });
    }

    setInsights(newInsights);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar isRunning={isRunning} />
      
      <div className="flex-1 container mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel - Parameters */}
        <div className="lg:col-span-3 space-y-4">
          <ParametersPanel
            tanks={tanks}
            selectedTankId={selectedTankId}
            onSelectTank={setSelectedTankId}
          />
        </div>

        {/* Center Panel - Graphs */}
        <div className="lg:col-span-6 space-y-4">
            <GraphsPanel
              temperatureData={timeSeriesByTank[selectedTank?.id || ""]?.temperature || [{ time: Date.now(), value: selectedTank?.temperature ?? 0 }]}
              pHData={timeSeriesByTank[selectedTank?.id || ""]?.pH || [{ time: Date.now(), value: selectedTank?.pH ?? 0 }]}
              oxygenData={timeSeriesByTank[selectedTank?.id || ""]?.oxygen || [{ time: Date.now(), value: selectedTank?.oxygen ?? 0 }]}
              tank={selectedTank}
              isRunning={isRunning}
            />
        </div>

        {/* Right Panel - Controls */}
        <div className="lg:col-span-3 space-y-4">
          <ControlPanel
            isRunning={isRunning}
            onPause={onPause}
            onReset={onReset}
            onExport={onExport}
            selectedTank={selectedTank}
          />
        </div>
      </div>

      {/* Bottom Panel - Insights */}
      <div className="container mx-auto p-6">
        <InsightsPanel insights={insights} />
      </div>
    </div>
  );
};

export default Dashboard;
