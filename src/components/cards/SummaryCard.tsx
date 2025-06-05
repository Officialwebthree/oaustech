import React from 'react';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import CardLayout from './CardLayout';
import { useWaterQuality } from '../../context/WaterQualityContext';

const SummaryCard: React.FC = () => {
  const { waterLevel, turbidity, ph, salinity, temperature } = useWaterQuality();
  
  // Determine overall status
  const getStatus = (param: string, value: number): { status: string; icon: JSX.Element } => {
    switch (param) {
      case 'waterLevel':
        if (value > 30 && value < 90) return { status: 'Optimal', icon: <CheckCircle className="h-4 w-4 text-green-500" /> };
        return { status: 'Warning', icon: <AlertCircle className="h-4 w-4 text-orange-500" /> };
      
      case 'turbidity':
        if (value < 5) return { status: 'Excellent', icon: <CheckCircle className="h-4 w-4 text-green-500" /> };
        return { status: 'Warning', icon: <AlertCircle className="h-4 w-4 text-orange-500" /> };
      
      case 'ph':
        if (value >= 6.5 && value <= 8.5) return { status: 'Optimal', icon: <CheckCircle className="h-4 w-4 text-green-500" /> };
        if (value >= 5 && value <= 9) return { status: 'Acceptable', icon: <AlertCircle className="h-4 w-4 text-yellow-500" /> };
        return { status: 'Critical', icon: <XCircle className="h-4 w-4 text-red-500" /> };
      
      case 'salinity':
        if (value >= 70 && value <= 90) return { status: 'Optimal', icon: <CheckCircle className="h-4 w-4 text-green-500" /> };
        if (value >= 50 && value <= 95) return { status: 'Acceptable', icon: <AlertCircle className="h-4 w-4 text-yellow-500" /> };
        return { status: 'Warning', icon: <AlertCircle className="h-4 w-4 text-orange-500" /> };
      
      case 'temperature':
        if (value >= 25 && value <= 35) return { status: 'Optimal', icon: <CheckCircle className="h-4 w-4 text-green-500" /> };
        return { status: 'Warning', icon: <AlertCircle className="h-4 w-4 text-orange-500" /> };
      
      default:
        return { status: 'Unknown', icon: <AlertCircle className="h-4 w-4 text-gray-500" /> };
    }
  };
  
  const waterLevelStatus = getStatus('waterLevel', waterLevel);
  const turbidityStatus = getStatus('turbidity', turbidity);
  const phStatus = getStatus('ph', ph);
  const salinityStatus = getStatus('salinity', salinity);
  const temperatureStatus = getStatus('temperature', temperature);
  
  // Calculate overall system status
  const statuses = [waterLevelStatus, turbidityStatus, phStatus, salinityStatus, temperatureStatus];
  const criticalCount = statuses.filter(s => s.status === 'Critical').length;
  const warningCount = statuses.filter(s => s.status === 'Warning' || s.status === 'Acceptable').length;
  
  let overallStatus = 'Optimal';
  let overallColor = 'bg-green-100 text-green-800';
  let overallIcon = <CheckCircle className="h-5 w-5 text-green-500" />;
  
  if (criticalCount > 0) {
    overallStatus = 'Critical';
    overallColor = 'bg-red-100 text-red-800';
    overallIcon = <XCircle className="h-5 w-5 text-red-500" />;
  } else if (warningCount > 0) {
    overallStatus = 'Warning';
    overallColor = 'bg-yellow-100 text-yellow-800';
    overallIcon = <AlertCircle className="h-5 w-5 text-yellow-500" />;
  }
  
  const updateTime = new Date().toLocaleTimeString();
  
  return (
    <CardLayout 
      title="System Status" 
      icon={overallIcon}
      infoText="Summary of all water quality parameters and overall system status."
    >
      <div className="space-y-4">
        {/* Overall status */}
        <div className={`${overallColor} rounded-lg p-3 flex items-center justify-between`}>
          <div className="font-medium">Overall Water Quality</div>
          <div className="font-bold">{overallStatus}</div>
        </div>
        
        {/* Parameters summary */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-500 mb-1">Parameter Status</div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between bg-slate-50 p-2 rounded">
              <span className="text-sm text-slate-700">Water Level</span>
              <div className="flex items-center">
                {waterLevelStatus.icon}
                <span className="text-xs ml-1">{waterLevelStatus.status}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-slate-50 p-2 rounded">
              <span className="text-sm text-slate-700">Turbidity</span>
              <div className="flex items-center">
                {turbidityStatus.icon}
                <span className="text-xs ml-1">{turbidityStatus.status}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-slate-50 p-2 rounded">
              <span className="text-sm text-slate-700">pH Level</span>
              <div className="flex items-center">
                {phStatus.icon}
                <span className="text-xs ml-1">{phStatus.status}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-slate-50 p-2 rounded">
              <span className="text-sm text-slate-700">Salinity</span>
              <div className="flex items-center">
                {salinityStatus.icon}
                <span className="text-xs ml-1">{salinityStatus.status}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-slate-50 p-2 rounded">
              <span className="text-sm text-slate-700">Temperature</span>
              <div className="flex items-center">
                {temperatureStatus.icon}
                <span className="text-xs ml-1">{temperatureStatus.status}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Last updated */}
        <div className="text-xs text-slate-400 text-right">
          Last updated: {updateTime}
        </div>
      </div>
    </CardLayout>
  );
};

export default SummaryCard;