import React from 'react';
import { Droplets } from 'lucide-react';
import CardLayout from './CardLayout';
import { useWaterQuality } from '../../context/WaterQualityContext';
import { motion } from 'framer-motion';

const SalinityCard: React.FC = () => {
  const { salinity } = useWaterQuality();
  
  // Define color based on salinity level
  let fillColor = 'bg-green-400';
  let status = 'Optimal';
  let statusColor = 'text-green-600';
  
  if (salinity < 50) {
    fillColor = 'bg-red-400';
    status = 'Too Low';
    statusColor = 'text-red-600';
  } else if (salinity < 70) {
    fillColor = 'bg-yellow-400';
    status = 'Acceptable';
    statusColor = 'text-yellow-600';
  } else if (salinity > 95) {
    fillColor = 'bg-orange-400';
    status = 'High';
    statusColor = 'text-orange-600';
  }
  
  return (
    <CardLayout 
      title="Salinity" 
      icon={<Droplets className="h-5 w-5 text-blue-500" />}
      infoText="Measures the salt content in water. The optimal range depends on the water's purpose."
    >
      <div className="space-y-4">
        {/* Salinity meter visualization */}
        <div className="relative h-8 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className={`absolute left-0 top-0 h-full ${fillColor} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${salinity}%` }}
            transition={{ type: "spring", damping: 12 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"></div>
          </motion.div>
          
          {/* Markers */}
          {[0, 25, 50, 75, 100].map((mark) => (
            <div 
              key={mark} 
              className="absolute top-0 h-full flex items-center"
              style={{ left: `${mark}%` }}
            >
              <div className="h-2 w-0.5 bg-slate-300"></div>
            </div>
          ))}
          
          {/* Value indicator */}
          <div 
            className="absolute top-0 h-full flex items-center justify-center text-xs font-bold text-white"
            style={{ left: `${Math.min(Math.max(salinity - 5, 5), 95)}%` }}
          >
            {salinity}%
          </div>
        </div>
        
        {/* Labels under the bar */}
        <div className="flex justify-between text-xs text-slate-500">
          <div>Low (0%)</div>
          <div>Optimal (70-90%)</div>
          <div>High (100%)</div>
        </div>
        
        {/* Current reading */}
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium text-slate-700">Salinity Level</div>
            <div className="text-2xl font-bold text-slate-800">{salinity}%</div>
          </div>
          <div className="bg-green-100 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <span className={`inline-block h-2 w-2 rounded-full ${fillColor} mr-2`}></span>
            <span className={statusColor}>{status}</span>
          </div>
        </div>
      </div>
    </CardLayout>
  );
};

export default SalinityCard;