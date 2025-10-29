import { DataPoint, TankData } from "@/types/aquaculture";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Activity } from "lucide-react";

interface GraphsPanelProps {
  temperatureData: DataPoint[];
  pHData: DataPoint[];
  oxygenData: DataPoint[];
  tank: TankData;
  isRunning: boolean;
}

const GraphsPanel = ({ temperatureData, pHData, oxygenData, tank, isRunning }: GraphsPanelProps) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 rounded-lg border border-primary/30">
          <p className="text-sm text-muted-foreground">
            {formatTime(payload[0].payload.time)}
          </p>
          <p className="text-lg font-bold text-primary">
            {payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const chartConfig = {
    margin: { top: 10, right: 10, left: -20, bottom: 0 },
  };

  if (!isRunning && temperatureData.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-poppins glow-text flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Real-Time Monitoring
        </h3>
        <div className="glass-card p-12 rounded-xl text-center">
          <div className="text-muted-foreground text-lg shimmer">
            Waiting for simulation to start...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold font-poppins glow-text flex items-center gap-2">
        <Activity className="w-5 h-5 animate-pulse" />
        Real-Time Monitoring
      </h3>

      {/* Temperature Chart */}
      <div className="glass-card p-4 rounded-xl">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-muted-foreground font-poppins">
            Temperature vs Time
          </h4>
          <div className="text-xs text-muted-foreground mt-1">
            Optimal: {tank.optimalTemp}°C ± 2°C
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={temperatureData} {...chartConfig}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(184, 100%, 40%)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(184, 100%, 40%)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 50%, 20%)" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatTime}
              stroke="hsl(180, 30%, 70%)"
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              domain={[tank.optimalTemp - 5, tank.optimalTemp + 5]}
              stroke="hsl(180, 30%, 70%)"
              tick={{ fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(184, 100%, 40%)" 
              strokeWidth={2}
              fill="url(#tempGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* pH Chart */}
      <div className="glass-card p-4 rounded-xl">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-muted-foreground font-poppins">
            pH Level vs Time
          </h4>
          <div className="text-xs text-muted-foreground mt-1">
            Optimal: {tank.optimalPH} ± 0.5
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={pHData} {...chartConfig}>
            <defs>
              <linearGradient id="pHGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(184, 100%, 70%)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(184, 100%, 70%)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 50%, 20%)" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatTime}
              stroke="hsl(180, 30%, 70%)"
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              domain={[tank.optimalPH - 1, tank.optimalPH + 1]}
              stroke="hsl(180, 30%, 70%)"
              tick={{ fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(184, 100%, 70%)" 
              strokeWidth={2}
              fill="url(#pHGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Oxygen Chart */}
      <div className="glass-card p-4 rounded-xl">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-muted-foreground font-poppins">
            Dissolved Oxygen vs Time
          </h4>
          <div className="text-xs text-muted-foreground mt-1">
            Minimum: {tank.minOxygen} mg/L
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={oxygenData} {...chartConfig}>
            <defs>
              <linearGradient id="o2Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 50%, 20%)" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatTime}
              stroke="hsl(180, 30%, 70%)"
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              domain={[0, 10]}
              stroke="hsl(180, 30%, 70%)"
              tick={{ fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(142, 76%, 36%)" 
              strokeWidth={2}
              fill="url(#o2Gradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraphsPanel;
