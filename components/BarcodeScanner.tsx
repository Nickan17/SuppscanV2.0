import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import Colors from '@/constants/Colors';

interface BarcodeScannerProps {
  onScan: (data: string) => void;
  active: boolean;
}

export default function BarcodeScanner({
  onScan,
  active,
}: BarcodeScannerProps) {
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

      // In a real app, you might want to validate the barcode format here
      console.log('Scanned barcode:', data);

      // Pass the scanned barcode to the parent component
      onScan(data);

      // Reset the scanner after a short delay
      setTimeout(() => {
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
          <TouchableOpacity
            style={styles.webPlaceholder}
            activeOpacity={0.9}
            onPress={() => handleBarCodeScanned({ data: 'DEMO123456' })}
          >
            <Text style={styles.scanButtonText}>Tap to Scan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {active && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          barCodeTypes={['ean13']}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      {!active && <View style={styles.webPlaceholder} />}
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  scanButtonText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
});
