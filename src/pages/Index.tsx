import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import { TankData, SimulationState } from "@/types/aquaculture";
import sampleData from "@/data/sampleData.json";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isRunning: false,
    startTime: null,
    tanks: [],
  });

  useEffect(() => {
    if (!simulationState.isRunning) return;

    const interval = setInterval(() => {
      setSimulationState(prev => ({
        ...prev,
        tanks: prev.tanks.map(tank => updateTankParameters(tank)),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [simulationState.isRunning]);

  const updateTankParameters = (tank: TankData): TankData => {
    // Simulate parameter changes with realistic logic
    const tempDrift = (Math.random() - 0.5) * 0.4;
    const tempToOptimal = (tank.optimalTemp - tank.temperature) * 0.05;
    
    const pHChange = (Math.random() - 0.5) * 0.04;
    
    const oxygenChange = (Math.random() - 0.3) * 0.4;
    const feedImpact = tank.feedCycle === "Auto" ? -0.3 : 0;
    
    const ammoniaIncrease = 0.005 * (tank.feedRate / 100);
    const biofilterReduction = Math.random() * 0.003;

    return {
      ...tank,
      temperature: Math.max(
        tank.optimalTemp - 5,
        Math.min(tank.optimalTemp + 5, tank.temperature + tempDrift + tempToOptimal)
      ),
      pH: Math.max(
        tank.optimalPH - 1,
        Math.min(tank.optimalPH + 1, tank.pH + pHChange)
      ),
      oxygen: Math.max(
        0,
        Math.min(10, tank.oxygen + oxygenChange + feedImpact)
      ),
      ammonia: Math.max(
        0,
        Math.min(1, tank.ammonia + ammoniaIncrease - biofilterReduction)
      ),
    };
  };

  const handleStart = () => {
    setSimulationState({
      isRunning: true,
      startTime: Date.now(),
      tanks: sampleData.tanks as TankData[],
    });
    toast({
      title: "Simulation Started",
      description: "Real-time monitoring is now active for all tanks.",
    });
  };

  const handlePause = () => {
    setSimulationState(prev => ({
      ...prev,
      isRunning: !prev.isRunning,
    }));
    toast({
      title: simulationState.isRunning ? "Simulation Paused" : "Simulation Resumed",
      description: simulationState.isRunning 
        ? "Data collection temporarily stopped."
        : "Continuing real-time monitoring.",
    });
  };

  const handleReset = () => {
    setSimulationState({
      isRunning: false,
      startTime: null,
      tanks: [],
    });
    toast({
      title: "Simulation Reset",
      description: "All data cleared. Ready to start fresh.",
    });
  };

  const handleExport = () => {
    const csv = generateCSV(simulationState.tanks);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aquaculture-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "CSV file downloaded successfully.",
    });
  };

  const generateCSV = (tanks: TankData[]) => {
    const headers = "Tank ID,Name,Species,Temperature (°C),pH,Oxygen (mg/L),Ammonia (ppm),Feed Cycle,Feed Rate (%),Fish Count\n";
    const rows = tanks.map(t => 
      `${t.id},${t.name},${t.species},${t.temperature.toFixed(2)},${t.pH.toFixed(2)},${t.oxygen.toFixed(2)},${t.ammonia.toFixed(3)},${t.feedCycle},${t.feedRate},${t.fishCount}`
    ).join("\n");
    return headers + rows;
  };

  if (!simulationState.startTime) {
    return <Hero onStart={handleStart} />;
  }

  return (
    <Dashboard
      tanks={simulationState.tanks}
      isRunning={simulationState.isRunning}
      onPause={handlePause}
      onReset={handleReset}
      onExport={handleExport}
    />
  );
};

export default Index;
