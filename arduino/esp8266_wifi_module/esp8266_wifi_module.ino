/*
  Water Quality Monitoring System - ESP8266 WiFi Module
  
  This code receives sensor data from Arduino and sends it to the web server
  
  Hardware: ESP8266 (NodeMCU or Wemos D1 Mini)
  Communication: Serial from Arduino
  
  Configure your WiFi credentials and server URL below
*/

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

// WiFi credentials - CHANGE THESE TO YOUR NETWORK
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Server configuration - CHANGE THIS TO YOUR SERVER IP
const char* serverURL = "http://192.168.1.100:3001/api/sensor-data";

// Variables for sensor data
float temperature = 0.0;
float ph = 7.0;
float turbidity = 0.0;
float salinity = 0.0;
float waterLevel = 0.0;

// Timing variables
unsigned long lastSend = 0;
const unsigned long SEND_INTERVAL = 5000; // Send every 5 seconds

// WiFi and HTTP client
WiFiClient wifiClient;
HTTPClient http;

void setup() {
  Serial.begin(9600);
  
  Serial.println();
  Serial.println("Water Quality Monitoring - ESP8266 WiFi Module");
  
  // Connect to WiFi
  connectToWiFi();
  
  Serial.println("System ready!");
}

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected. Reconnecting...");
    connectToWiFi();
  }
  
  // Read data from Arduino
  if (Serial.available()) {
    readSensorData();
  }
  
  // Send data to server
  unsigned long currentTime = millis();
  if (currentTime - lastSend >= SEND_INTERVAL) {
    sendDataToServer();
    lastSend = currentTime;
  }
  
  delay(100);
}

void connectToWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("WiFi connected successfully!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println("Failed to connect to WiFi. Check credentials.");
  }
}

void readSensorData() {
  String dataString = Serial.readStringUntil('\n');
  dataString.trim();
  
  if (dataString.length() > 0) {
    // Parse comma-separated values
    int commaIndex1 = dataString.indexOf(',');
    int commaIndex2 = dataString.indexOf(',', commaIndex1 + 1);
    int commaIndex3 = dataString.indexOf(',', commaIndex2 + 1);
    int commaIndex4 = dataString.indexOf(',', commaIndex3 + 1);
    
    if (commaIndex1 > 0 && commaIndex2 > 0 && commaIndex3 > 0 && commaIndex4 > 0) {
      temperature = dataString.substring(0, commaIndex1).toFloat();
      ph = dataString.substring(commaIndex1 + 1, commaIndex2).toFloat();
      turbidity = dataString.substring(commaIndex2 + 1, commaIndex3).toFloat();
      salinity = dataString.substring(commaIndex3 + 1, commaIndex4).toFloat();
      waterLevel = dataString.substring(commaIndex4 + 1).toFloat();
      
      Serial.println("Data received from Arduino:");
      Serial.println("Temperature: " + String(temperature) + "°C");
      Serial.println("pH: " + String(ph));
      Serial.println("Turbidity: " + String(turbidity) + " ppm");
      Serial.println("Salinity: " + String(salinity) + "%");
      Serial.println("Water Level: " + String(waterLevel) + "%");
    }
  }
}

void sendDataToServer() {
  if (WiFi.status() == WL_CONNECTED) {
    http.begin(wifiClient, serverURL);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["temperature"] = temperature;
    jsonDoc["ph"] = ph;
    jsonDoc["turbidity"] = turbidity;
    jsonDoc["salinity"] = salinity;
    jsonDoc["waterLevel"] = waterLevel;
    jsonDoc["deviceId"] = "ESP8266_001";
    jsonDoc["timestamp"] = millis();
    
    String jsonString;
    serializeJson(jsonDoc, jsonString);
    
    Serial.println("Sending data to server...");
    Serial.println("Payload: " + jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response Code: " + String(httpResponseCode));
      Serial.println("Response: " + response);
      
      if (httpResponseCode == 200) {
        Serial.println("Data sent successfully!");
      }
    } else {
      Serial.println("Error sending data. HTTP Response Code: " + String(httpResponseCode));
    }
    
    http.end();
  } else {
    Serial.println("WiFi not connected. Cannot send data.");
  }
}