import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import Colors from '@/constants/Colors';

interface BarcodeScannerProps {
  onScan: (data: string) => void;
  active: boolean;
}

export default function BarcodeScanner({ onScan, active }: BarcodeScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } else {
        // On web, just set permission to true for demo purposes
        setHasPermission(true);
      }
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned && active) {
      setScanned(true);
      
      // For demo purposes, using a timeout to simulate processing
      setTimeout(() => {
        // Pass custom barcode for demo
        onScan('DEMO123456');
        // Reset for next scan (in real app this would be reset on return to this screen)
        setScanned(false);
      }, 1000);
    }
  };

  // Web placeholder view
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.webCamera}>
          <Text style={styles.webText}>
            Camera access is limited on web.{'\n'}
            Click anywhere to simulate a scan.
          </Text>
          <View 
            style={styles.webPlaceholder}
            onTouchEnd={() => handleBarCodeScanned({ data: 'DEMO123456' })}
          />
        </View>
      </View>
    );
  }

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }

  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'upc_e', 'upc_a', 'ean13', 'ean8', 'code39', 'code128'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  webCamera: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  webPlaceholder: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
});