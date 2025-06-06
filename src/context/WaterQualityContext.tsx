import React, { createContext, useContext, useState, useEffect } from 'react';

type WaterQualityContextType = {
  waterLevel: number;
  turbidity: number;
  ph: number;
  salinity: number;
  temperature: number;
  isConnected: boolean;
  lastUpdate: Date | null;
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
  const [ph, setPh] = useState(7.1);
  const [salinity, setSalinity] = useState(85);
  const [temperature, setTemperature] = useState(31.5);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [trendData, setTrendData] = useState<WaterQualityContextType['trendData']>([]);
  const [historicalData, setHistoricalData] = useState<WaterQualityContextType['historicalData']>([]);

  // API base URL - adjust this based on your server setup
  const API_BASE_URL = 'http://localhost:3001/api';

  // Fetch sensor data from the API
  const fetchSensorData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sensor-data`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const { data, trendData: apiTrendData, historicalData: apiHistoricalData } = result;
        
        // Update sensor values
        setWaterLevel(data.waterLevel);
        setTurbidity(data.turbidity);
        setPh(data.ph);
        setSalinity(data.salinity);
        setTemperature(data.temperature);
        setLastUpdate(new Date(data.timestamp));
        
        // Update trend and historical data
        if (apiTrendData) {
          setTrendData(apiTrendData);
        }
        if (apiHistoricalData) {
          setHistoricalData(apiHistoricalData);
        }
        
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      setIsConnected(false);
    }
  };

  // Fetch data on component mount and set up polling
  useEffect(() => {
    // Initial fetch
    fetchSensorData();
    
    // Set up polling every 2 seconds
    const interval = setInterval(fetchSensorData, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Check connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`);
        setIsConnected(response.ok);
      } catch (error) {
        setIsConnected(false);
      }
    };

    // Check connection every 10 seconds
    const connectionInterval = setInterval(checkConnection, 10000);
    
    return () => clearInterval(connectionInterval);
  }, []);

  const value = {
    waterLevel,
    turbidity,
    ph,
    salinity,
    temperature,
    isConnected,
    lastUpdate,
    trendData,
    historicalData
  };

  return (
    <WaterQualityContext.Provider value={value}>
      {children}
    </WaterQualityContext.Provider>
  );
};