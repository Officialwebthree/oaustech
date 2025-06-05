import React from 'react';
import { FlaskConical } from 'lucide-react';
import CardLayout from './CardLayout';
import { useWaterQuality } from '../../context/WaterQualityContext';
import { motion } from 'framer-motion';

const WaterLevelCard: React.FC = () => {
  const { waterLevel } = useWaterQuality();
  
  // Define status and colors based on water level
  let status = 'Optimal';
  let statusColor = 'text-green-500';
  let fillColor = 'bg-blue-400';
  
  if (waterLevel < 30) {
    status = 'Low';
    statusColor = 'text-red-500';
    fillColor = 'bg-red-400';
  } else if (waterLevel < 50) {
    status = 'Moderate';
    statusColor = 'text-yellow-500';
    fillColor = 'bg-yellow-400';
  } else if (waterLevel > 90) {
    status = 'High';
    statusColor = 'text-orange-500';
    fillColor = 'bg-orange-400';
  }

  return (
    <CardLayout 
      title="Water Level" 
      icon={<FlaskConical className="h-5 w-5 text-blue-500" />}
      infoText="Displays the current water level in the tank as a percentage of total capacity."
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Tank visualization */}
        <div className="relative w-32 h-48 border-2 border-slate-300 rounded-b-lg mx-auto">
          {/* Water level animation */}
          <motion.div 
            className={`absolute bottom-0 w-full ${fillColor} rounded-b transition-all`}
            initial={{ height: 0 }}
            animate={{ height: `${waterLevel}%` }}
            transition={{ type: "spring", damping: 15 }}
            style={{
              boxShadow: 'inset 0 10px 30px rgba(255, 255, 255, 0.3)'
            }}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-white/30 rounded"></div>
          </motion.div>
          
          {/* Level markers */}
          {[20, 40, 60, 80].map((level) => (
            <div 
              key={level} 
              className="absolute w-2 h-0.5 bg-slate-300 left-0"
              style={{ bottom: `${level}%` }}
            ></div>
          ))}
          
          {/* Side levels text */}
          <div className="absolute -left-6 bottom-[80%] text-xs text-slate-500">80%</div>
          <div className="absolute -left-6 bottom-[40%] text-xs text-slate-500">40%</div>
          <div className="absolute -left-6 bottom-0 text-xs text-slate-500">0%</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-700">{waterLevel.toFixed(1)}%</div>
          <div className={`text-sm font-medium ${statusColor}`}>{status}</div>
        </div>
      </div>
    </CardLayout>
  );
};

export default WaterLevelCard;