import React, { createContext, useContext, useState, useEffect } from 'react';

type WaterQualityContextType = {
  waterLevel: number;
  turbidity: number;
  ph: number;
  salinity: number;
  temperature: number;
  trendData: Array<{
    time: number;
    temperature: number;
    ph: number;
    turbidity: number;
    salinity: number;
  }>;
  historicalData: Array<{
    date: string;
    temperature: number;
    ph: number;
    turbidity: number;
    salinity: number;
    status: string;
  }>;
};

const WaterQualityContext = createContext<WaterQualityContextType | undefined>(undefined);

export const useWaterQuality = () => {
  const context = useContext(WaterQualityContext);
  if (!context) {
    throw new Error('useWaterQuality must be used within a WaterQualityProvider');
  }
  return context;
};

type WaterQualityProviderProps = {
  children: React.ReactNode;
};

export const WaterQualityProvider: React.FC<WaterQualityProviderProps> = ({ children }) => {
  const [waterLevel, setWaterLevel] = useState(75);
  const [turbidity, setTurbidity] = useState(4.5);
  const [ph] = useState(7.1);
  const [salinity, setSalinity] = useState(85);
  const [temperature, setTemperature] = useState(31.5);
  const [trendData, setTrendData] = useState<WaterQualityContextType['trendData']>([]);
  const [historicalData] = useState<WaterQualityContextType['historicalData']>(() => {
    const past7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString(),
        temperature: 31 + Math.random(),
        ph: 7.1 + (Math.random() * 0.4 - 0.2),
        turbidity: 4 + Math.random(),
        salinity: 85 + (Math.random() * 10 - 5),
        status: Math.random() > 0.8 ? 'Warning' : 'Optimal'
      };
    }).reverse();
    return past7Days;
  });

  // Update trend data
  useEffect(() => {
    const updateTrend = () => {
      const now = Date.now();
      setTrendData(prev => {
        const newData = [...prev, {
          time: now,
          temperature,
          ph,
          turbidity,
          salinity
        }];
        if (newData.length > 3600) {
          return newData.slice(-3600);
        }
        return newData;
      });
    };

    const trendInterval = setInterval(updateTrend, 1000);
    return () => clearInterval(trendInterval);
  }, [temperature, ph, turbidity, salinity]);

  // Simulate fluctuating readings
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setTurbidity(prev => {
        const fluctuation = Math.random() * 0.1 - 0.05;
        return Math.max(4, Math.min(5, prev + fluctuation));
      });
      
      setSalinity(prev => {
        const fluctuation = Math.random() * 2 - 1;
        return Math.max(70, Math.min(95, prev + fluctuation));
      });
      
      setTemperature(prev => {
        const fluctuation = Math.random() * 0.2 - 0.1;
        return Math.max(31, Math.min(32, prev + fluctuation));
      });
    }, 1000);

    return () => clearInterval(updateInterval);
  }, []);

  // Simulate water level changes
  useEffect(() => {
    const waterLevelInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setWaterLevel((prev) => {
          const change = Math.random() * 5 - 2.5;
          return Math.max(20, Math.min(95, prev + change));
        });
      }
    }, 3000);

    return () => clearInterval(waterLevelInterval);
  }, []);

  const value = {
    waterLevel,
    turbidity,
    ph,
    salinity,
    temperature,
    trendData,
    historicalData
  };

  return (
    <WaterQualityContext.Provider value={value}>
      {children}
    </WaterQualityContext.Provider>
  );
};