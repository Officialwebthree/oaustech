import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import CardLayout from './CardLayout';
import { useWaterQuality } from '../../context/WaterQualityContext';

const TrendsCard: React.FC = () => {
  const { trendData } = useWaterQuality();

  return (
    <CardLayout
      title="Real-time Trends"
      icon={<TrendingUp className="h-5 w-5 text-violet-500" />}
      infoText="Live visualization of water quality parameters over the last hour"
    >
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <defs>
              <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="phGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="turbidityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="salinityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="time" 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={false}
              name="Temperature (°C)"
              fill="url(#temperatureGradient)"
            />
            <Line 
              type="monotone" 
              dataKey="ph" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
              name="pH"
              fill="url(#phGradient)"
            />
            <Line 
              type="monotone" 
              dataKey="turbidity" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={false}
              name="Turbidity (ppm)"
              fill="url(#turbidityGradient)"
            />
            <Line 
              type="monotone" 
              dataKey="salinity" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={false}
              name="Salinity (%)"
              fill="url(#salinityGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardLayout>
  );
};

export default TrendsCard;