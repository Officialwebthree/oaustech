import React from 'react';
import WaterLevelCard from './cards/WaterLevelCard';
import TurbidityCard from './cards/TurbidityCard';
import PHCard from './cards/PHCard';
import SalinityCard from './cards/SalinityCard';
import TemperatureCard from './cards/TemperatureCard';
import SummaryCard from './cards/SummaryCard';
import TrendsCard from './cards/TrendsCard';
import HistoricalRecords from './cards/HistoricalRecords';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WaterLevelCard />
        <TurbidityCard />
        <PHCard />
        <SalinityCard />
        <TemperatureCard />
        <SummaryCard />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendsCard />
        <HistoricalRecords />
      </div>
    </div>
  );
};

export default Dashboard;