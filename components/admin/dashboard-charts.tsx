"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ChartProps {
  data: Record<string, number>;
}

export function UserDistributionChart({ data }: ChartProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name: name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase()),
    value
  })).filter(item => item.value > 0);

  const COLORS = ['#f59e0b', '#3b82f6', '#6366f1', '#a855f7', '#10b981', '#14b8a6'];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RegistrationTrendChart() {
    // Mock trend for now until we add historical tracking
    const data = [
      { name: 'Mon', count: 4 },
      { name: 'Tue', count: 7 },
      { name: 'Wed', count: 5 },
      { name: 'Thu', count: 9 },
      { name: 'Fri', count: 12 },
      { name: 'Sat', count: 3 },
      { name: 'Sun', count: 6 },
    ];
  
    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
