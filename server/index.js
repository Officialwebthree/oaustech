import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Store the latest sensor data
let sensorData = {
  waterLevel: 75,
  turbidity: 4.5,
  ph: 7.1,
  salinity: 85,
  temperature: 31.5,
  timestamp: Date.now()
};

// Store historical data for trends
let trendData = [];
let historicalData = [];

// Initialize with some sample historical data
const initializeHistoricalData = () => {
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
  historicalData = past7Days;
};

initializeHistoricalData();

// Routes

// GET endpoint to fetch current sensor data
app.get('/api/sensor-data', (req, res) => {
  res.json({
    success: true,
    data: sensorData,
    trendData: trendData.slice(-60), // Last 60 readings
    historicalData
  });
});

// POST endpoint for Arduino/ESP8266 to send sensor data
app.post('/api/sensor-data', (req, res) => {
  try {
    const {
      waterLevel,
      turbidity,
      ph,
      salinity,
      temperature
    } = req.body;

    // Validate incoming data
    if (typeof waterLevel !== 'number' || 
        typeof turbidity !== 'number' || 
        typeof ph !== 'number' || 
        typeof salinity !== 'number' || 
        typeof temperature !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Invalid data format. All sensor values must be numbers.'
      });
    }

    // Update sensor data
    sensorData = {
      waterLevel: Math.max(0, Math.min(100, waterLevel)),
      turbidity: Math.max(0, turbidity),
      ph: Math.max(0, Math.min(14, ph)),
      salinity: Math.max(0, Math.min(100, salinity)),
      temperature: temperature,
      timestamp: Date.now()
    };

    // Add to trend data
    trendData.push({
      time: sensorData.timestamp,
      temperature: sensorData.temperature,
      ph: sensorData.ph,
      turbidity: sensorData.turbidity,
      salinity: sensorData.salinity
    });

    // Keep only last 3600 readings (1 hour if sending every second)
    if (trendData.length > 3600) {
      trendData = trendData.slice(-3600);
    }

    console.log('Received sensor data:', sensorData);

    res.json({
      success: true,
      message: 'Sensor data received successfully',
      data: sensorData
    });

  } catch (error) {
    console.error('Error processing sensor data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Water Quality Monitoring API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Water Quality Monitoring API running on http://localhost:${PORT}`);
  console.log(`Sensor data endpoint: POST http://localhost:${PORT}/api/sensor-data`);
  console.log(`Data retrieval endpoint: GET http://localhost:${PORT}/api/sensor-data`);
});