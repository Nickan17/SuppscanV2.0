import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { useRouter } from 'expo-router';
import { OpenFoodFactsService } from '@/services/openFoodFacts';
import { ActivityIndicator } from 'react-native-paper';

export default function BarcodeScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      if (Platform.OS !== 'web') {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      } else {
        setHasPermission(false);
        Alert.alert(
          'Barcode Scanner',
          'Barcode scanning is not supported on web. Please use the search function instead.',
        );
      }
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: BarCodeScannerResult) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const product = await OpenFoodFactsService.getProductByBarcode(data);

      if (product) {
        router.push({
          pathname: '/product-detail',
          params: { product: JSON.stringify(product) },
        });
      } else {
        Alert.alert(
          'Product Not Found',
          'We could not find this product in our database. Would you like to search for it instead?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Search',
              onPress: () =>
                router.push(`/search?query=${encodeURIComponent(data)}`),
            },
          ],
        );
      }
    } catch (error) {
      console.error('Error handling barcode scan:', error);
      Alert.alert('Error', 'Failed to process barcode. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          No access to camera. Please enable camera permissions in your device
          settings.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <View style={styles.webPlaceholder}>
          <Text style={styles.webPlaceholderText}>
            Barcode scanning is not available on web. Please use the search
            function.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <BarCodeScanner
            onBarCodeScanned={isLoading ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.overlay}>
            <View style={styles.finder}>
              <View style={[styles.edge, styles.edgeTopLeft]} />
              <View style={[styles.edge, styles.edgeTopRight]} />
              <View style={[styles.edge, styles.edgeBottomLeft]} />
              <View style={[styles.edge, styles.edgeBottomRight]} />
            </View>
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Looking up product...</Text>
              </View>
            )}
            <Text style={styles.instruction}>
              Position the barcode inside the frame to scan
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webPlaceholder: {
    padding: 20,
    alignItems: 'center',
  },
  webPlaceholderText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  finder: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  edge: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#007AFF',
  },
  edgeTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 10,
  },
  edgeTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 10,
  },
  edgeBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 10,
  },
  edgeBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  instruction: {
    position: 'absolute',
    bottom: 50,
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
