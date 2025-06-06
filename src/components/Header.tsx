import React from 'react';
import { Droplets, Wifi, WifiOff } from 'lucide-react';
import { useWaterQuality } from '../context/WaterQualityContext';

const Header: React.FC = () => {
  const { isConnected, lastUpdate } = useWaterQuality();

  return (
    <header className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Droplets className="h-8 w-8 text-cyan-100" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">OAUSTECH NRF</h1>
            <p className="text-xs text-cyan-100">Smart Water Quality Monitoring</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {lastUpdate && (
            <div className="text-xs text-cyan-100">
              Last update: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
          <div className={`rounded-full px-3 py-1 text-sm flex items-center ${
            isConnected 
              ? 'bg-green-700/30 text-green-100' 
              : 'bg-red-700/30 text-red-100'
          }`}>
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 mr-2" />
                <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                <span>Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 mr-2" />
                <span className="inline-block h-2 w-2 rounded-full bg-red-400 mr-2"></span>
                <span>Disconnected</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;