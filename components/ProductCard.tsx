import React from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from 'shadcn-ui';

interface ProductCardProps {
  product: {
    image: string;
    name: string;
    brand: string;
    score: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <View className="flex-row items-center p-4 bg-white rounded-2xl mb-3 shadow-sm">
      <Image
        source={{ uri: product.image }}
        className="w-14 h-14 rounded-lg mr-3"
      />
      <View className="flex-1">
        <Text className="font-semibold text-text text-base">
          {product.name}
        </Text>
        <Text className="text-xs text-text/50">{product.brand}</Text>
      </View>
      <View className="items-center">
        <Text className="font-bold text-lg text-primary">{product.score}</Text>
        <Text className="text-[10px] text-text/50">/100</Text>
      </View>
    </View>
  );
}
