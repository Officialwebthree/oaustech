# Water Quality Monitoring System - Arduino & ESP8266 Code

This directory contains the Arduino and ESP8266 code for the IoT Water Quality Monitoring System.

## Hardware Requirements

### Arduino Uno/Nano
- DS18B20 Temperature Sensor
- pH Sensor Module
- Turbidity Sensor
- TDS/Salinity Sensor
- HC-SR04 Ultrasonic Sensor (for water level)
- ESP8266 Module (for WiFi connectivity)

### ESP8266 (NodeMCU/Wemos D1 Mini)
- Can be used standalone or as a WiFi module for Arduino

## Wiring Diagram

### Arduino Connections:
```
DS18B20 Temperature Sensor:
- VCC -> 5V
- GND -> GND
- Data -> Digital Pin 2

pH Sensor:
- VCC -> 5V
- GND -> GND
- Signal -> Analog Pin A0

Turbidity Sensor:
- VCC -> 5V
- GND -> GND
- Signal -> Analog Pin A1

TDS/Salinity Sensor:
- VCC -> 5V
- GND -> GND
- Signal -> Analog Pin A2

HC-SR04 Ultrasonic Sensor:
- VCC -> 5V
- GND -> GND
- Trig -> Digital Pin 7
- Echo -> Digital Pin 8

ESP8266 Module:
- VCC -> 3.3V
- GND -> GND
- RX -> Digital Pin 3
- TX -> Digital Pin 4
```

## Setup Instructions

### 1. Arduino Setup
1. Install required libraries:
   - OneWire
   - DallasTemperature
   - SoftwareSerial (usually pre-installed)

2. Upload `water_quality_sensors.ino` to your Arduino

3. Calibrate sensors according to manufacturer specifications

### 2. ESP8266 Setup
1. Install ESP8266 board package in Arduino IDE
2. Install required libraries:
   - ESP8266WiFi
   - ESP8266HTTPClient
   - ArduinoJson

3. Configure WiFi credentials in `esp8266_wifi_module.ino`:
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   ```

4. Update server URL to match your computer's IP address:
   ```cpp
   const char* serverURL = "http://YOUR_COMPUTER_IP:3001/api/sensor-data";
   ```

5. Upload `esp8266_wifi_module.ino` to your ESP8266

### 3. Server Setup
1. Start the Node.js server:
   ```bash
   npm run server
   ```

2. The server will run on `http://localhost:3001`

3. Find your computer's IP address and update the ESP8266 code accordingly

## Sensor Calibration

### pH Sensor
- Calibrate using pH 4.0, 7.0, and 10.0 buffer solutions
- Adjust `PH_ACID_VOLTAGE` and `PH_SLOPE` constants in the code

### TDS/Salinity Sensor
- Calibrate using known TDS solutions
- Adjust conversion formula if needed

### Turbidity Sensor
- Calibrate using known turbidity standards
- Adjust voltage-to-NTU conversion formula

### Water Level Sensor
- Measure your tank dimensions
- Update `TANK_HEIGHT` and `TANK_EMPTY_DISTANCE` constants

## Troubleshooting

### Common Issues:

1. **WiFi Connection Failed**
   - Check SSID and password
   - Ensure ESP8266 is within WiFi range
   - Check power supply (ESP8266 needs stable 3.3V)

2. **Sensor Readings Incorrect**
   - Check wiring connections
   - Verify sensor power supply
   - Calibrate sensors properly

3. **Data Not Reaching Server**
   - Check server IP address in ESP8266 code
   - Ensure server is running
   - Check firewall settings

4. **Serial Communication Issues**
   - Check baud rates match (9600)
   - Verify RX/TX connections
   - Check for loose connections

## Data Format

The system sends data in JSON format:
```json
{
  "temperature": 31.5,
  "ph": 7.1,
  "turbidity": 4.5,
  "salinity": 85.0,
  "waterLevel": 75.0,
  "deviceId": "ESP8266_001",
  "timestamp": 1234567890
}
```

## Power Considerations

- Arduino: 5V via USB or external power supply
- ESP8266: 3.3V (can be powered from Arduino 3.3V pin for low-power sensors)
- Consider using a level shifter for 5V ↔ 3.3V communication if needed

## Future Enhancements

- Add battery backup for continuous monitoring
- Implement OTA (Over-The-Air) updates for ESP8266
- Add local data logging with SD card
- Implement sensor fault detection and alerts
- Add support for multiple sensor nodes