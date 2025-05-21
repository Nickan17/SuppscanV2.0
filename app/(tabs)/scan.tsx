import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BarcodeScanner from '@/components/BarcodeScanner';

export default function ScanScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top translucent header */}
      <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4 pt-10 pb-2 bg-white/70">
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={28} color="#01796F" />
        </TouchableOpacity>
        <Text className="text-base text-text/70">
          Align barcode within frame
        </Text>
        <View style={{ width: 28 }} />
      </View>
      {/* Fullscreen scanner */}
      <View className="flex-1">
        <BarcodeScanner />
      </View>
    </SafeAreaView>
  );
}
