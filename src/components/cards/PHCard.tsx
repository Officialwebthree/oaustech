import React from 'react';
import { Beaker } from 'lucide-react';
import CardLayout from './CardLayout';
import { useWaterQuality } from '../../context/WaterQualityContext';

const PHCard: React.FC = () => {
  const { ph } = useWaterQuality();
  
  // Define the colors and ranges for the pH scale
  const phColors = [
    { value: 0, color: '#FF0000' }, // Very acidic - red
    { value: 2, color: '#FF4500' },
    { value: 4, color: '#FFA500' }, // Acidic - orange
    { value: 6, color: '#FFFF00' }, // Slightly acidic - yellow
    { value: 7, color: '#00FF00' }, // Neutral - green
    { value: 8, color: '#00FFFF' }, // Slightly alkaline - cyan
    { value: 10, color: '#0000FF' }, // Alkaline - blue
    { value: 12, color: '#8A2BE2' }, // Very alkaline - purple
    { value: 14, color: '#800080' }  // Extremely alkaline - dark purple
  ];
  
  // Calculate the position on the scale (0-100%)
  const position = (ph / 14) * 100;
  
  // Determine the status based on pH value
  let status = 'Neutral';
  let statusColor = 'text-green-500';
  
  if (ph < 6.5) {
    status = 'Acidic';
    statusColor = 'text-orange-500';
  } else if (ph > 8.5) {
    status = 'Alkaline';
    statusColor = 'text-blue-500';
  }
  
  return (
    <CardLayout 
      title="pH Level" 
      icon={<Beaker className="h-5 w-5 text-indigo-500" />}
      infoText="pH measures how acidic or alkaline the water is. The optimal range for most water systems is 6.5-8.5."
    >
      <div className="space-y-4">
        {/* pH scale visualization */}
        <div className="relative h-16">
          {/* pH scale background */}
          <div 
            className="absolute inset-x-0 h-8 rounded-lg overflow-hidden"
            style={{
              background: `linear-gradient(to right, ${phColors.map(c => c.color).join(', ')})`
            }}
          ></div>
          
          {/* pH marker labels */}
          <div className="absolute inset-x-0 top-8 flex justify-between px-1 pt-1">
            {[0, 2, 4, 6, 8, 10, 12, 14].map((value) => (
              <div key={value} className="text-xs text-slate-600 flex flex-col items-center">
                <div className="h-2 w-0.5 bg-slate-400 mb-1"></div>
                {value}
              </div>
            ))}
          </div>
          
          {/* Current pH indicator */}
          <div 
            className="absolute top-0 w-6 h-10 -ml-3 flex flex-col items-center"
            style={{ left: `${position}%` }}
          >
            <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-slate-800"></div>
            <div className="h-8 w-1 bg-slate-800 rounded-full"></div>
          </div>
        </div>
        
        {/* Current value and status */}
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium text-slate-700">Current pH</div>
            <div className="text-2xl font-bold text-slate-800">{ph.toFixed(1)}</div>
          </div>
          <div className={`bg-green-100 ${statusColor.replace('text', 'text')} px-3 py-1 rounded-full text-sm font-medium`}>
            {status}
          </div>
        </div>
        
        {/* Additional context */}
        <div className="text-sm text-slate-500 bg-slate-50 p-2 rounded">
          <p>Water with pH 7.1 is slightly alkaline and within the ideal range for drinking water.</p>
        </div>
      </div>
    </CardLayout>
  );
};

export default PHCard;