/*
  Water Quality Monitoring System - Arduino Code
  
  This code reads various water quality sensors and sends data to ESP8266
  
  Sensors:
  - DS18B20 Temperature Sensor (Digital Pin 2)
  - pH Sensor (Analog Pin A0)
  - Turbidity Sensor (Analog Pin A1)
  - TDS/Salinity Sensor (Analog Pin A2)
  - Ultrasonic Sensor HC-SR04 for Water Level (Digital Pins 7, 8)
  
  Communication: Serial to ESP8266 (Pins 0, 1)
*/

#include <OneWire.h>
#include <DallasTemperature.h>
#include <SoftwareSerial.h>

// Pin definitions
#define ONE_WIRE_BUS 2
#define PH_PIN A0
#define TURBIDITY_PIN A1
#define TDS_PIN A2
#define TRIG_PIN 7
#define ECHO_PIN 8

// Temperature sensor setup
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature temperatureSensor(&oneWire);

// Communication with ESP8266
SoftwareSerial esp8266(3, 4); // RX, TX

// Calibration constants
const float PH_NEUTRAL = 7.0;
const float PH_ACID_VOLTAGE = 2.032;
const float PH_SLOPE = -5.70;

const float TDS_VREF = 5.0;
const float TDS_SCOUNT = 30;

// Tank dimensions (in cm)
const float TANK_HEIGHT = 100.0; // Total tank height
const float TANK_EMPTY_DISTANCE = 20.0; // Distance when tank is empty

// Variables for sensor readings
float temperature = 0.0;
float ph = 7.0;
float turbidity = 0.0;
float salinity = 0.0;
float waterLevel = 0.0;

// Timing variables
unsigned long lastReading = 0;
const unsigned long READING_INTERVAL = 2000; // Read every 2 seconds

void setup() {
  // Initialize serial communications
  Serial.begin(9600);
  esp8266.begin(9600);
  
  // Initialize temperature sensor
  temperatureSensor.begin();
  
  // Initialize ultrasonic sensor pins
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  
  Serial.println("Water Quality Monitoring System - Arduino");
  Serial.println("Initializing sensors...");
  
  delay(2000);
  Serial.println("System ready!");
}

void loop() {
  unsigned long currentTime = millis();
  
  if (currentTime - lastReading >= READING_INTERVAL) {
    // Read all sensors
    readTemperature();
    readPH();
    readTurbidity();
    readTDS();
    readWaterLevel();
    
    // Send data to ESP8266
    sendDataToESP8266();
    
    // Print data to serial monitor for debugging
    printSensorData();
    
    lastReading = currentTime;
  }
  
  delay(100);
}

void readTemperature() {
  temperatureSensor.requestTemperatures();
  temperature = temperatureSensor.getTempCByIndex(0);
  
  // Check for sensor error
  if (temperature == DEVICE_DISCONNECTED_C) {
    temperature = 25.0; // Default value
    Serial.println("Warning: Temperature sensor disconnected");
  }
}

void readPH() {
  int sensorValue = 0;
  
  // Take multiple readings for stability
  for (int i = 0; i < 10; i++) {
    sensorValue += analogRead(PH_PIN);
    delay(10);
  }
  
  float voltage = (sensorValue / 10.0) * (5.0 / 1024.0);
  ph = PH_NEUTRAL + ((PH_ACID_VOLTAGE - voltage) / PH_SLOPE);
  
  // Constrain pH to realistic range
  ph = constrain(ph, 0.0, 14.0);
}

void readTurbidity() {
  int sensorValue = analogRead(TURBIDITY_PIN);
  float voltage = sensorValue * (5.0 / 1024.0);
  
  // Convert voltage to NTU (Nephelometric Turbidity Units)
  // This is a simplified conversion - calibrate based on your specific sensor
  if (voltage < 2.5) {
    turbidity = 3000;
  } else {
    turbidity = -1120.4 * voltage * voltage + 5742.3 * voltage - 4352.9;
  }
  
  // Convert NTU to ppm (approximate)
  turbidity = turbidity * 0.001;
  turbidity = constrain(turbidity, 0.0, 10.0);
}

void readTDS() {
  int sensorValue = 0;
  
  // Take multiple readings
  for (int i = 0; i < TDS_SCOUNT; i++) {
    sensorValue += analogRead(TDS_PIN);
    delay(10);
  }
  
  float voltage = (sensorValue / TDS_SCOUNT) * (TDS_VREF / 1024.0);
  
  // Temperature compensation
  float compensationCoefficient = 1.0 + 0.02 * (temperature - 25.0);
  float compensationVoltage = voltage / compensationCoefficient;
  
  // Convert voltage to TDS value
  float tdsValue = (133.42 * compensationVoltage * compensationVoltage * compensationVoltage 
                   - 255.86 * compensationVoltage * compensationVoltage 
                   + 857.39 * compensationVoltage) * 0.5;
  
  // Convert TDS to salinity percentage (simplified)
  salinity = map(tdsValue, 0, 1000, 0, 100);
  salinity = constrain(salinity, 0.0, 100.0);
}

void readWaterLevel() {
  // Send ultrasonic pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // Read echo
  long duration = pulseIn(ECHO_PIN, HIGH);
  float distance = (duration * 0.034) / 2; // Convert to cm
  
  // Calculate water level percentage
  float waterHeight = TANK_HEIGHT - distance + TANK_EMPTY_DISTANCE;
  waterLevel = (waterHeight / TANK_HEIGHT) * 100.0;
  waterLevel = constrain(waterLevel, 0.0, 100.0);
}

void sendDataToESP8266() {
  // Create JSON-like string to send to ESP8266
  String dataString = String(temperature, 2) + "," + 
                     String(ph, 2) + "," + 
                     String(turbidity, 2) + "," + 
                     String(salinity, 1) + "," + 
                     String(waterLevel, 1);
  
  esp8266.println(dataString);
}

void printSensorData() {
  Serial.println("=== Sensor Readings ===");
  Serial.print("Temperature: "); Serial.print(temperature); Serial.println(" °C");
  Serial.print("pH: "); Serial.println(ph);
  Serial.print("Turbidity: "); Serial.print(turbidity); Serial.println(" ppm");
  Serial.print("Salinity: "); Serial.print(salinity); Serial.println(" %");
  Serial.print("Water Level: "); Serial.print(waterLevel); Serial.println(" %");
  Serial.println("========================");
}