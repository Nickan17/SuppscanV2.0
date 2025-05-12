import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import SupplementCard from '@/components/SupplementCard';
import { getTopSupplements } from '@/utils/supplementData';

const categories = [
  'All',
  'Vitamins',
  'Minerals',
  'Protein',
  'Amino Acids',
  'Pre-Workout',
  'Weight Loss',
  'Sleep',
  'Hormonal Support',
];

export default function TopBrandsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const topSupplements = getTopSupplements(selectedCategory);

  const handleSelectProduct = (id: string) => {
    router.push({
      pathname: '/results',
      params: { barcode: id },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Top Rated Supplements</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScrollView}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={topSupplements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SupplementCard
            supplement={item}
            onPress={() => handleSelectProduct(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  categoryScrollView: {
    maxHeight: 50,
  },
  categoryContainer: {
    paddingHorizontal: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCategory: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    color: Colors.text,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: Colors.background,
  },
  listContent: {
    padding: 16,
  },
});