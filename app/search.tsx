import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, X, Barcode } from 'lucide-react-native';
import { OpenFoodFactsService } from '@/services/openFoodFacts';
import { Supplement } from '@/types/supplement';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Supplement[]>([]);
  const router = useRouter();

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Search by name/brand
      const searchResults = await OpenFoodFactsService.searchProducts(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBarcodeScan = async () => {
    router.push('/barcode-scanner');
  };

  const handleSelectProduct = (product: Supplement) => {
    router.push({
      pathname: '/product-detail',
      params: { product: JSON.stringify(product) },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={({ nativeEvent: { text } }) => searchProducts(text)}
          placeholder="Search by product name or brand"
          placeholderTextColor="#999"
          returnKeyType="search"
        />
        {searchQuery ? (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery('');
              setResults([]);
            }}
            style={styles.clearButton}
          >
            <X size={20} color="#666" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleBarcodeScan}
            style={styles.barcodeButton}
          >
            <Barcode size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleSelectProduct(item)}
            >
              <View style={styles.resultContent}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.product_name || 'Unknown Product'}
                </Text>
                <Text style={styles.brandName} numberOfLines={1}>
                  {item.brands || 'Unknown Brand'}
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.resultsList}
        />
      ) : searchQuery ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found</Text>
          <Text style={styles.emptySubtext}>
            Try a different search term or scan a barcode
          </Text>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Search for supplements</Text>
          <Text style={styles.emptySubtext}>
            Enter a product name or scan a barcode
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 16,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#000',
  },
  clearButton: {
    padding: 8,
    marginLeft: 8,
  },
  barcodeButton: {
    padding: 8,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsList: {
    paddingHorizontal: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultContent: {
    flex: 1,
    marginRight: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  brandName: {
    fontSize: 14,
    color: '#666',
  },
  arrow: {
    fontSize: 20,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});
