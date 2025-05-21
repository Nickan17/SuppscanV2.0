import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import ProductCard from '@/components/ProductCard';
import { getHistoryData } from '@/utils/supplementData';

export default function HistoryScreen() {
  const [history, setHistory] = useState(getHistoryData());

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear your scan history?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => setHistory([]),
        },
      ]
    );
  };

  const handleSelectProduct = (id: string) => {
    router.push({
      pathname: '/results',
      params: { barcode: id },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-4 pt-6 pb-2">
        <Text className="text-xl font-bold text-text">Your Scan History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory} accessibilityRole="button" accessibilityLabel="Clear scan history" className="flex-row items-center">
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            <Text className="text-base text-[#FF3B30] ml-1">Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      {history.length > 0 ? (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectProduct(item.id)} accessibilityRole="button" accessibilityLabel={`View details for ${item.name}`}>
              <ProductCard product={item} />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ padding: 16 }}
        />
      ) : (
        <View className="flex-1 items-center justify-center px-6">
          <Image source={require('../../assets/hero.png')} className="w-40 h-40 mb-6" />
          <Text className="text-base text-text/70 text-center">No scans yet – start exploring!</Text>
            <Ionicons name="scan" size={20} color={Colors.background} />
            <Text style={styles.scanButtonText}>Start Scanning</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButtonText: {
    color: Colors.error,
    fontWeight: '500',
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  scanButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  scanButtonText: {
    color: Colors.background,
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});