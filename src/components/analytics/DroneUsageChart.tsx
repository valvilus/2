import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DroneUsageData {
  name: string;
  flights: number;
  hours: number;
  distance: number;
}

const mockData: DroneUsageData[] = [
  { name: 'DJI Mavic 3', flights: 45, hours: 67, distance: 890 },
  { name: 'DJI Air 2S', flights: 38, hours: 52, distance: 720 },
  { name: 'DJI Mini 3 Pro', flights: 29, hours: 43, distance: 580 },
  { name: 'Autel EVO II', flights: 33, hours: 48, distance: 650 },
  { name: 'Skydio 2+', flights: 41, hours: 61, distance: 810 },
];

const DroneUsageChart: React.FC = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={mockData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="name" 
            stroke="rgb(var(--color-text))"
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-45}
            textAnchor="end"
          />
          <YAxis stroke="rgb(var(--color-text))" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(var(--color-background))',
              border: '1px solid rgba(var(--color-text), 0.1)',
              borderRadius: '0.5rem',
            }}
          />
          <Legend />
          <Bar 
            dataKey="flights" 
            fill="rgb(var(--color-primary))" 
            name="Количество полетов"
          />
          <Bar 
            dataKey="hours" 
            fill="rgb(var(--color-secondary))" 
            name="Часы налета"
          />
          <Bar 
            dataKey="distance" 
            fill="rgb(var(--color-accent))" 
            name="Пройденное расстояние (км)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DroneUsageChart;