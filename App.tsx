import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as Sensors from 'expo-sensors';
import { Camera } from 'expo-camera';

// Import your existing components (adapted for React Native)
import MapComponent from './components/Map';
import ControlsComponent from './components/Controls';
import HeaderComponent from './components/Header';
import HotspotInfoComponent from './components/HotspotInfo';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [accelerometerData, setAccelerometerData] = useState({});

  useEffect(() => {
    (async () => {
      // Request camera permission
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');

      // Request location permission
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus === 'granted');

      if (locationStatus !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // Start accelerometer for gesture detection
      Sensors.Accelerometer.setUpdateInterval(100);
      const subscription = Sensors.Accelerometer.addListener(accelerometerData => {
        setAccelerometerData(accelerometerData);
      });

      return () => subscription?.remove();
    })();
  }, []);

  // Handle gesture detection
  useEffect(() => {
    const { x, y, z } = accelerometerData;
    
    // Simple gesture detection
    if (Math.abs(x) > 1.5) {
      // Horizontal shake detected
      console.log('Horizontal gesture detected');
    }
    
    if (Math.abs(y) > 1.5) {
      // Vertical shake detected
      console.log('Vertical gesture detected');
    }
    
    if (Math.abs(z) > 1.5) {
      // Z-axis movement detected
      console.log('Z-axis gesture detected');
    }
  }, [accelerometerData]);

  if (hasCameraPermission === null || hasLocationPermission === null) {
    return <View style={styles.container}><Text>Requesting permissions...</Text></View>;
  }

  if (hasCameraPermission === false || hasLocationPermission === false) {
    return (
      <View style={styles.container}>
        <Text>Camera or location permission is required for this app.</Text>
        <Text>Please enable permissions in your device settings.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <HeaderComponent 
        title="FINDS - Sharks From Space"
        subtitle="Mobile Edition"
        location={location}
      />
      
      {/* Map Component */}
      <View style={styles.mapContainer}>
        <MapComponent 
          location={location}
          style={styles.map}
        />
      </View>
      
      {/* Controls */}
      <ControlsComponent 
        onRegionChange={(region) => console.log('Region changed:', region)}
        onPointsChange={(points) => console.log('Points changed:', points)}
        style={styles.controls}
      />
      
      {/* Hotspot Info */}
      <HotspotInfoComponent 
        style={styles.hotspotInfo}
      />
      
      {/* Gesture Indicator */}
      <View style={styles.gestureIndicator}>
        <Text style={styles.gestureText}>
          Gesture Controls Active
        </Text>
        <Text style={styles.gestureSubtext}>
          Shake device to interact
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },
  mapContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 100,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 15,
  },
  hotspotInfo: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 15,
    maxWidth: 200,
  },
  gestureIndicator: {
    position: 'absolute',
    top: 50,
    left: 10,
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
    borderRadius: 5,
    padding: 10,
  },
  gestureText: {
    color: '#00ff00',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gestureSubtext: {
    color: '#00ff00',
    fontSize: 10,
  },
});