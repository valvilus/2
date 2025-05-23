import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface FlightActivityData {
  date: string;
  flights: number;
  hours: number;
}

const mockData: FlightActivityData[] = [
  { date: '2025-01', flights: 45, hours: 67 },
  { date: '2025-02', flights: 52, hours: 78 },
  { date: '2025-03', flights: 48, hours: 72 },
  { date: '2025-04', flights: 61, hours: 91 },
  { date: '2025-05', flights: 55, hours: 82 },
  { date: '2025-06', flights: 67, hours: 100 },
];

const FlightActivityChart: React.FC = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={mockData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorFlights" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(var(--color-primary))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="rgb(var(--color-primary))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(var(--color-secondary))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="rgb(var(--color-secondary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            stroke="rgb(var(--color-text))"
            tickFormatter={(value) => {
              const date = new Date(value);
              return new Intl.DateTimeFormat('ru-RU', { month: 'short' }).format(date);
            }}
          />
          <YAxis stroke="rgb(var(--color-text))" />
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(var(--color-background))',
              border: '1px solid rgba(var(--color-text), 0.1)',
              borderRadius: '0.5rem',
            }}
            labelFormatter={(value) => {
              const date = new Date(value);
              return new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(date);
            }}
          />
          <Area
            type="monotone"
            dataKey="flights"
            stroke="rgb(var(--color-primary))"
            fillOpacity={1}
            fill="url(#colorFlights)"
            name="Количество полетов"
          />
          <Area
            type="monotone"
            dataKey="hours"
            stroke="rgb(var(--color-secondary))"
            fillOpacity={1}
            fill="url(#colorHours)"
            name="Часы налета"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FlightActivityChart;