import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import BarcodeScanner from '@/components/BarcodeScanner';

export default function HomeScreen() {
  const [scanning, setScanning] = useState(true);

  const handleBarcodeScan = (data: string) => {
    // Simulate barcode scan
    console.log('Barcode scanned:', data);
    // Navigate to results page with the scanned barcode data
    router.push({
      pathname: '/results',
      params: { barcode: data },
    });
  };

  const handleManualSearch = () => {
    router.push('/search');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
          style={styles.headerImage}
        />
        <View style={styles.headerContent}>
          <Text style={styles.title}>SuppScan</Text>
          <Text style={styles.subtitle}>
            Scan Any Supplement. Get the Truth.
          </Text>
        </View>
      </View>

      <View style={styles.scannerContainer}>
        <BarcodeScanner
          onScan={handleBarcodeScan}
          active={scanning}
        />
        <View style={styles.scannerOverlay}>
          <View style={styles.scannerTargetContainer}>
            <View style={styles.scannerTarget} />
          </View>
          
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleManualSearch}
          >
            <Ionicons name="search" size={18} color={Colors.primary} />
            <Text style={styles.searchButtonText}>
              Can't scan? Search manually
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          SuppScan uses AI to analyze supplement ingredients and provide quality scores based on clinical dosing, third-party testing, and brand transparency.
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