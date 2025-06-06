# Water Quality Monitoring System - Wiring Diagram

## Component List

### Arduino Uno/Nano
- 1x Arduino Uno or Nano
- 1x DS18B20 Temperature Sensor
- 1x pH Sensor Module (with BNC connector)
- 1x Turbidity Sensor Module
- 1x TDS/EC Sensor Module
- 1x HC-SR04 Ultrasonic Sensor
- 1x ESP8266 Module (ESP-01 or NodeMCU)
- 1x Breadboard
- Jumper wires
- 4.7kΩ resistor (for DS18B20)

## Detailed Wiring Connections

### DS18B20 Temperature Sensor
```
DS18B20          Arduino
VCC (Red)    ->  5V
GND (Black)  ->  GND
Data (Yellow)->  Digital Pin 2
```
**Note:** Add a 4.7kΩ pull-up resistor between VCC and Data pin

### pH Sensor Module
```
pH Sensor        Arduino
VCC          ->  5V
GND          ->  GND
Signal (A)   ->  Analog Pin A0
```

### Turbidity Sensor
```
Turbidity        Arduino
VCC          ->  5V
GND          ->  GND
Signal       ->  Analog Pin A1
```

### TDS/Salinity Sensor
```
TDS Sensor       Arduino
VCC          ->  5V
GND          ->  GND
Signal       ->  Analog Pin A2
```

### HC-SR04 Ultrasonic Sensor (Water Level)
```
HC-SR04          Arduino
VCC          ->  5V
GND          ->  GND
Trig         ->  Digital Pin 7
Echo         ->  Digital Pin 8
```

### ESP8266 Module Communication
```
ESP8266          Arduino
VCC          ->  3.3V
GND          ->  GND
RX           ->  Digital Pin 3 (SoftwareSerial TX)
TX           ->  Digital Pin 4 (SoftwareSerial RX)
```

## Power Supply Considerations

- **Arduino**: 5V via USB or external adapter (7-12V)
- **ESP8266**: 3.3V (can be powered from Arduino's 3.3V pin if current draw is low)
- **Sensors**: Most sensors operate at 5V
- **Total Current**: Approximately 200-300mA

## Alternative ESP8266 Standalone Setup

If using NodeMCU or Wemos D1 Mini as standalone:

### NodeMCU Pin Mapping
```
Sensor               NodeMCU Pin
DS18B20 Data     ->  D2 (GPIO4)
pH Sensor        ->  A0
Turbidity        ->  D1 (GPIO5) - using external ADC
TDS Sensor       ->  D5 (GPIO14) - using external ADC
HC-SR04 Trig     ->  D6 (GPIO12)
HC-SR04 Echo     ->  D7 (GPIO13)
```

**Note:** NodeMCU has only one analog pin, so you'll need an external ADC (like ADS1115) for multiple analog sensors.

## Circuit Diagram (ASCII)

```
                    Arduino Uno
                   ┌─────────────┐
                   │             │
    DS18B20 ───────┤ D2      5V  ├─── VCC (All Sensors)
                   │             │
    pH Sensor ─────┤ A0     GND  ├─── GND (All Sensors)
                   │             │
    Turbidity ─────┤ A1      D3  ├─── ESP8266 RX
                   │             │
    TDS Sensor ────┤ A2      D4  ├─── ESP8266 TX
                   │             │
    HC-SR04 Trig ──┤ D7     3.3V ├─── ESP8266 VCC
                   │             │
    HC-SR04 Echo ──┤ D8     GND  ├─── ESP8266 GND
                   │             │
                   └─────────────┘
```

## Sensor Placement Guidelines

### Water Level Sensor (HC-SR04)
- Mount above the water tank
- Ensure clear line of sight to water surface
- Protect from water splashes
- Distance from water surface: 2cm to 4m

### pH Sensor
- Submerge electrode completely in water
- Keep electrode wet when not in use
- Calibrate regularly with buffer solutions
- Avoid air bubbles on electrode surface

### Turbidity Sensor
- Submerge sensor head completely
- Keep optical surfaces clean
- Avoid direct sunlight interference
- Position away from water inlet/outlet

### TDS/Salinity Sensor
- Submerge electrode completely
- Ensure good water circulation around sensor
- Clean electrode regularly
- Temperature compensation is automatic

### Temperature Sensor (DS18B20)
- Waterproof version recommended
- Submerge completely in water
- Response time: 750ms for 12-bit resolution
- Accuracy: ±0.5°C

## Safety Considerations

1. **Electrical Safety**
   - Use waterproof enclosures for electronics
   - Ensure proper grounding
   - Use GFCI protection if near water

2. **Sensor Protection**
   - Use waterproof sensors or proper sealing
   - Protect cables from water ingress
   - Regular maintenance and cleaning

3. **Power Supply**
   - Use stable power supply
   - Consider battery backup for critical monitoring
   - Protect against power surges

## Troubleshooting Common Wiring Issues

1. **No sensor readings**: Check power connections (VCC/GND)
2. **Erratic readings**: Check for loose connections
3. **Communication errors**: Verify RX/TX connections
4. **Power issues**: Ensure adequate current supply
5. **Interference**: Keep sensor cables away from power lines
```