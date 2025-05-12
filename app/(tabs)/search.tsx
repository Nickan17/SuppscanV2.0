import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import SearchBar from '@/components/SearchBar';
import SupplementCard from '@/components/SupplementCard';
import { searchSupplements } from '@/utils/supplementData';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(searchSupplements(''));

  const handleSearch = (text: string) => {
    setQuery(text);
    setResults(searchSupplements(text));
  };

  const handleSelectProduct = (id: string) => {
    router.push({
      pathname: '/results',
      params: { barcode: id },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Supplements</Text>
      </View>
      
      <SearchBar 
        value={query}
        onChangeText={handleSearch}
        placeholder="Search by product name or brand"
      />
      
      <View style={styles.resultsContainer}>
        {results.length > 0 ? (
          <FlatList
            data={results}
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
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No supplements found</Text>
            <Text style={styles.emptySubtext}>Try a different search term</Text>
          </View>
        )}
      </View>
      
      <View style={styles.manualSection}>
        <Text style={styles.manualTitle}>
          Can't find your supplement?
        </Text>
        <TouchableOpacity style={styles.manualButton}>
          <Text style={styles.manualButtonText}>Enter ingredient list manually</Text>
        </TouchableOpacity>
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
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  resultsContainer: {
    flex: 1,
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
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
  },
  manualSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
  },
  manualTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 12,
  },
  manualButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  manualButtonText: {
    color: Colors.background,
    fontWeight: '600',
    fontSize: 16,
  },
});