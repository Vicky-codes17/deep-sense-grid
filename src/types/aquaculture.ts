export interface TankData {
  id: string;
  name: string;
  species: string;
  temperature: number;
  pH: number;
  oxygen: number;
  ammonia: number;
  feedCycle: "Auto" | "Manual";
  feedRate: number;
  fishCount: number;
  avgWeight: number;
  optimalTemp: number;
  optimalPH: number;
  minOxygen: number;
  maxAmmonia: number;
}

export interface DataPoint {
  time: number;
  value: number;
}

export interface Insight {
  type: "success" | "warning" | "danger";
  message: string;
}

export interface SimulationState {
  isRunning: boolean;
  startTime: number | null;
  tanks: TankData[];
}
