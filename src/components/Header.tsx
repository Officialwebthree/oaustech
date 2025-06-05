import React from 'react';
import { Droplets } from 'lucide-react';

const Header: React.FC = () => {
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
        <div className="flex items-center">
          <div className="bg-cyan-700/30 rounded-full px-3 py-1 text-sm flex items-center">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
            <span className="text-cyan-50">Live Monitoring</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;