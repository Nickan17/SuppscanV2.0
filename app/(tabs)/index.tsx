import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
// Try to import shadcn/ui Button, fallback to custom PrimaryButton if not found
let Button: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Button = require('@/components/ui/button').Button;
} catch {
  Button = ({ children, ...props }: any) => (
    <View
      style={{
        backgroundColor: '#01796F',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 12,
      }}
      {...props}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
        {children}
      </Text>
    </View>
  );
}

// Fallback component for when BarcodeScanner fails
const BarcodeScannerFallback = () => (
  <View style={styles.fallbackContainer}>
    <Ionicons name="camera" size={48} color={Colors.subtext} />
    <Text style={styles.fallbackText}>Scanner unavailable</Text>
    <Text style={styles.fallbackSubtext}>Please check camera permissions</Text>
  </View>
);

// Fallback component for when TestOpenRouter fails
const AIScoringFallback = () => (
  <View style={styles.fallbackContainer}>
    <Ionicons name="warning" size={48} color={Colors.warning} />
    <Text style={styles.fallbackText}>AI scoring unavailable</Text>
  </View>
);

export default function HomeScreen() {
  // --- existing logic preserved below ---
  const [scanning, setScanning] = useState(true);
  const [scannedProductName, setScannedProductName] = useState<string | null>(
    null,
  );
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Request camera permissions on mount
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        console.log('Requesting camera permission...');
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasCameraPermission(status === 'granted');
        if (status !== 'granted') {
          setCameraError('Camera permission not granted');
        }
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        setCameraError('Failed to access camera');
        setHasCameraPermission(false);
      }
    };

    requestCameraPermission();
  }, []);

  if (hasCameraPermission === null) {
    console.log('[SuppScan] Camera permission loading...');
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ fontSize: 24, color: 'black' }}>SuppScan</Text>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading camera...</Text>
      </SafeAreaView>
    );
  }

  const handleBarcodeScan = (data: string) => {
    try {
      console.log('Barcode scanned:', data);
      // For demo, map barcode to product name
      const productName = 'Optimum Nutrition Gold Standard Whey Protein';
      // In a real app, look up the product name from barcode
      setScannedProductName(productName);
      setScanning(false);
      // Optionally, don't navigate to results page for this demo
      // router.push({ pathname: '/results', params: { barcode: data } });
    } catch (error) {
      console.error('Error handling barcode scan:', error);
      // Optionally show error to user
    }
  };

  const handleManualSearch = () => {
    router.push('/search');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      <View className="items-center justify-center flex-1 px-6">
        <Image
          source={require('../../assets/hero.png')}
          className="w-48 h-48 mb-6"
        />
        <Text className="text-3xl font-bold text-text mb-2 text-center">
          Welcome to Supplement Scanner
        </Text>
        <Text className="text-base text-center text-text/70 mb-8">
          Scan or search supplements to reveal their true quality.
        </Text>
        <View className="flex flex-col space-y-3">
          <Button
            className="bg-primary w-full"
            accessibilityRole="button"
            accessibilityLabel="Search Products"
            onPress={() => router.push('/search')}
          >
            Search Products
          </Button>
          <Button
            variant="outline"
            className="w-full"
            accessibilityRole="button"
            accessibilityLabel="Scan Barcode"
            onPress={() => router.push('/scan')}
          >
            Scan Barcode
          </Button>
        </View>
      </View>
      {/* DEBUG: Minimal render check */}
      {/* <BarcodeScanner onScan={handleBarcodeScan} active={scanning} /> */}
      {/* <TestOpenRouter productName={scannedProductName} /> */}
      <View style={{ padding: 40 }}>
        <Text>Render Works ✅</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          SuppScan uses AI to analyze supplement ingredients and provide quality
          scores based on clinical dosing, third-party testing, and brand
          transparency.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    color: Colors.text,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  fallbackText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
  fallbackSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
  },
  header: {
    position: 'relative',
    height: 200,
    width: '100%',
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    opacity: 0.9,
  },
  headerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerTargetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerTarget: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
    borderRadius: 20,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerText: {
    color: Colors.subtext,
    textAlign: 'center',
    fontSize: 14,
  },
});
