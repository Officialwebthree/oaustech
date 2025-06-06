# Sensor Calibration Guide

## pH Sensor Calibration

### Required Materials
- pH 4.0 buffer solution
- pH 7.0 buffer solution  
- pH 10.0 buffer solution
- Distilled water for rinsing

### Calibration Steps
1. **Prepare Solutions**: Ensure buffer solutions are at room temperature
2. **Clean Electrode**: Rinse with distilled water and gently dry
3. **Calibrate pH 7.0**: 
   - Place electrode in pH 7.0 buffer
   - Wait for stable reading
   - Adjust `PH_NEUTRAL` constant if needed
4. **Calibrate pH 4.0**:
   - Rinse electrode and place in pH 4.0 buffer
   - Note voltage reading
   - Adjust `PH_ACID_VOLTAGE` constant
5. **Calculate Slope**:
   - Use formula: slope = (pH7_voltage - pH4_voltage) / (7.0 - 4.0)
   - Update `PH_SLOPE` constant

### Code Constants to Adjust
```cpp
const float PH_NEUTRAL = 7.0;        // pH value at neutral voltage
const float PH_ACID_VOLTAGE = 2.032; // Voltage reading at pH 4.0
const float PH_SLOPE = -5.70;        // Slope from calibration
```

## TDS/Salinity Sensor Calibration

### Required Materials
- TDS calibration solutions (84 µS/cm, 1413 µS/cm)
- Distilled water (0 TDS)

### Calibration Steps
1. **Zero Point**: Test in distilled water (should read ~0)
2. **Low Point**: Test in 84 µS/cm solution
3. **High Point**: Test in 1413 µS/cm solution
4. **Adjust Formula**: Modify the polynomial conversion if needed

### Code Section to Adjust
```cpp
// Convert voltage to TDS value
float tdsValue = (133.42 * compensationVoltage * compensationVoltage * compensationVoltage 
                 - 255.86 * compensationVoltage * compensationVoltage 
                 + 857.39 * compensationVoltage) * 0.5;
```

## Turbidity Sensor Calibration

### Required Materials
- Formazin turbidity standards (0, 20, 100, 800 NTU)
- Clean sample containers

### Calibration Steps
1. **Zero Turbidity**: Test with distilled water
2. **Low Turbidity**: Test with 20 NTU standard
3. **Medium Turbidity**: Test with 100 NTU standard
4. **High Turbidity**: Test with 800 NTU standard
5. **Create Calibration Curve**: Plot voltage vs NTU

### Code Section to Adjust
```cpp
// Convert voltage to NTU - adjust based on your calibration
if (voltage < 2.5) {
  turbidity = 3000;
} else {
  turbidity = -1120.4 * voltage * voltage + 5742.3 * voltage - 4352.9;
}
```

## Water Level Sensor Calibration

### Required Materials
- Measuring tape or ruler
- Empty tank for testing

### Calibration Steps
1. **Measure Tank**: Record actual tank height
2. **Empty Tank**: Measure distance from sensor to tank bottom
3. **Full Tank**: Measure distance from sensor to water surface when full
4. **Update Constants**:

```cpp
const float TANK_HEIGHT = 100.0;        // Your actual tank height in cm
const float TANK_EMPTY_DISTANCE = 20.0; // Distance when tank is empty
```

## Temperature Sensor Calibration

### DS18B20 Calibration
The DS18B20 is factory calibrated and typically doesn't require user calibration. However, you can verify accuracy:

1. **Ice Water Test**: Should read 0°C (±0.5°C)
2. **Boiling Water Test**: Should read 100°C at sea level (±0.5°C)
3. **Room Temperature**: Compare with calibrated thermometer

If adjustment is needed:
```cpp
// Add offset if required
temperature = temperatureSensor.getTempCByIndex(0) + TEMP_OFFSET;
```

## General Calibration Tips

1. **Regular Calibration**: Calibrate sensors monthly or as recommended
2. **Environmental Conditions**: Calibrate under similar conditions to actual use
3. **Multiple Points**: Use at least 2-3 calibration points per sensor
4. **Documentation**: Keep calibration records and dates
5. **Drift Monitoring**: Monitor sensor drift over time

## Calibration Verification

After calibration, test with known samples to verify accuracy:

```cpp
void verifyCalibration() {
  Serial.println("=== Calibration Verification ===");
  Serial.println("Test with known samples:");
  Serial.println("pH 7.0 buffer should read ~7.0");
  Serial.println("1413 µS/cm solution should read appropriate TDS");
  Serial.println("Clean water should show low turbidity");
  Serial.println("================================");
}
```

## Troubleshooting Calibration Issues

1. **Unstable Readings**: 
   - Check for air bubbles on electrodes
   - Ensure proper sensor submersion
   - Wait for temperature stabilization

2. **Drift Over Time**:
   - Clean sensors regularly
   - Replace aging electrodes
   - Check for contamination

3. **Non-linear Response**:
   - Use more calibration points
   - Consider polynomial fitting
   - Check sensor specifications

4. **Temperature Effects**:
   - Implement temperature compensation
   - Calibrate at operating temperature
   - Use temperature-stable references
```