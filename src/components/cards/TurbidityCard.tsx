import React from 'react';
import { Cloud, CloudFog } from 'lucide-react';
import CardLayout from './CardLayout';
import { useWaterQuality } from '../../context/WaterQualityContext';
import { motion } from 'framer-motion';

const TurbidityCard: React.FC = () => {
  const { turbidity } = useWaterQuality();
  
  // Calculate the percentage for the progress bar (4-5 ppm range)
  const progressPercentage = ((turbidity - 4) / 1) * 100;
  
  return (
    <CardLayout 
      title="Turbidity" 
      icon={<CloudFog className="h-5 w-5 text-cyan-500" />}
      infoText="Measures the cloudiness or haziness of water caused by suspended particles. Optimal range: 0-5 ppm."
    >
      <div className="space-y-4">
        {/* Turbidity meter visualization (accelerometer-like) */}
        <div className="relative h-40 bg-gradient-to-b from-sky-50 to-slate-100 rounded-lg border border-slate-200 overflow-hidden">
          {/* Scale lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-4">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tick) => (
              <div key={tick} className="flex items-center w-full">
                <div className="w-3 h-0.5 bg-slate-300"></div>
                <span className="text-xs text-slate-500 ml-1">{10 - tick}</span>
              </div>
            ))}
          </div>
          
          {/* The needle/indicator */}
          <motion.div 
            className="absolute left-3 w-full h-0.5 flex items-center"
            style={{ 
              top: `${100 - ((turbidity / 10) * 100)}%`,
            }}
            animate={{ 
              top: `${100 - ((turbidity / 10) * 100)}%` 
            }}
            transition={{ type: "spring", damping: 10 }}
          >
            <div className="w-full h-0.5 bg-cyan-500"></div>
            <div className="absolute -left-1 -top-1.5 w-4 h-4 bg-cyan-500 rounded-full shadow-md"></div>
          </motion.div>
          
          {/* Zones */}
          <div className="absolute inset-x-3 bottom-0 h-[50%] bg-green-100/50 border-t border-green-200"></div>
          <div className="absolute inset-x-3 bottom-[50%] h-[30%] bg-yellow-100/50 border-t border-yellow-200"></div>
          <div className="absolute inset-x-3 bottom-[80%] h-[20%] bg-red-100/50 border-t border-red-200"></div>
          
          {/* Current value */}
          <div className="absolute bottom-2 right-2 bg-white/80 rounded px-2 py-1 text-sm font-medium text-slate-700">
            {turbidity.toFixed(2)} ppm
          </div>
        </div>
        
        {/* Status */}
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium text-slate-700">Current Reading</div>
            <div className="text-2xl font-bold text-slate-800">{turbidity.toFixed(2)} ppm</div>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Cloud className="h-4 w-4 mr-1" />
            Excellent
          </div>
        </div>
      </div>
    </CardLayout>
  );
};

export default TurbidityCard;