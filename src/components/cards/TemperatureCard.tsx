import React from 'react';
import { Thermometer } from 'lucide-react';
import CardLayout from './CardLayout';
import { useWaterQuality } from '../../context/WaterQualityContext';
import { motion } from 'framer-motion';

const TemperatureCard: React.FC = () => {
  const { temperature } = useWaterQuality();
  
  // Calculate color and status based on temperature
  let color = 'text-green-500';
  let bgColor = 'bg-green-100';
  let status = 'Optimal';
  
  if (temperature < 25) {
    color = 'text-blue-500';
    bgColor = 'bg-blue-100';
    status = 'Cool';
  } else if (temperature > 35) {
    color = 'text-red-500';
    bgColor = 'bg-red-100';
    status = 'Hot';
  } else if (temperature > 30) {
    color = 'text-orange-500';
    bgColor = 'bg-orange-100';
    status = 'Warm';
  }
  
  // Calculate mercury height based on temperature (20-40°C range)
  const mercuryHeight = Math.min(100, Math.max(0, ((temperature - 20) / 20) * 100));
  
  return (
    <CardLayout 
      title="Temperature" 
      icon={<Thermometer className="h-5 w-5 text-red-500" />}
      infoText="Displays the current water temperature. Optimal range depends on the specific application."
    >
      <div className="flex space-x-6">
        {/* Thermometer visualization */}
        <div className="relative w-12 flex flex-col items-center">
          <div className="relative w-5 h-40 bg-slate-200 rounded-t-full overflow-hidden border border-slate-300">
            {/* Mercury */}
            <motion.div 
              className="absolute bottom-0 w-full bg-gradient-to-t from-red-500 to-red-400 rounded-t-full"
              initial={{ height: 0 }}
              animate={{ height: `${mercuryHeight}%` }}
              transition={{ type: "spring", damping: 10 }}
            ></motion.div>
            
            {/* Temperature marks */}
            {[0, 25, 50, 75, 100].map((mark, index) => (
              <div 
                key={mark} 
                className="absolute w-2 h-0.5 bg-slate-400 left-0"
                style={{ bottom: `${mark}%` }}
              >
                <span className="absolute -left-6 -top-1 text-xs text-slate-500">
                  {40 - (index * 5)}°C
                </span>
              </div>
            ))}
          </div>
          
          {/* Thermometer bulb */}
          <div className="w-7 h-7 rounded-full bg-red-500 border border-slate-300 relative -top-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full"></div>
          </div>
        </div>
        
        {/* Temperature information */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-sm text-slate-500 mb-1">Current Reading</div>
          <div className="text-3xl font-bold text-slate-800 flex items-baseline">
            <motion.span
              key={temperature.toFixed(1)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {temperature.toFixed(1)}
            </motion.span>
            <span className="text-lg ml-1">°C</span>
          </div>
          
          <div className={`${bgColor} ${color} px-3 py-1 rounded-full text-sm font-medium self-start mt-2`}>
            {status}
          </div>
          
          {/* Temperature history (mini chart) */}
          <div className="mt-4 h-10 bg-slate-50 rounded-md overflow-hidden flex items-end">
            {[...Array(20)].map((_, index) => {
              const randomHeight = 30 + Math.random() * 60;
              return (
                <div 
                  key={index} 
                  className="flex-1 bg-blue-400/50"
                  style={{ height: `${randomHeight}%` }}
                ></div>
              );
            })}
          </div>
          <div className="text-xs text-slate-400 mt-1">24-hour history</div>
        </div>
      </div>
    </CardLayout>
  );
};

export default TemperatureCard;