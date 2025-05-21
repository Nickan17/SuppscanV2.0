import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ProductCard from '@/components/ProductCard';
import { OpenFoodFactsService } from '@/services/openFoodFacts';
import { OpenRouterService } from '@/services/openRouter';
import { supabase } from '@/lib/supabase';

export default function SearchScreen() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [score, setScore] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiWarning, setAiWarning] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  // Handler for barcode scan
  const handleBarcodeScan = async (barcode: string) => {
    setScanning(false);
    setInput(barcode);
    await handleSearch(barcode);
  };

  // Modified search to optionally accept a value (for barcode)
  const handleSearch = async (overrideInput?: string) => {
    setLoading(true);
    setError(null);
    setProduct(null);
    setScore(null);
    setAiWarning(null);
    
    try {
      let found = null;
      const searchValue = (overrideInput ?? input).trim();
      console.log('🔍 Search value:', searchValue);
      
      const isBarcodeSearch = /^\d{8,14}$/.test(searchValue);
      
      // First try: OpenFoodFacts by barcode if input is a barcode
      if (isBarcodeSearch) {
        console.log('🔍 [1/3] Searching OpenFoodFacts by barcode...');
        try {
          found = await OpenFoodFactsService.getProductByBarcode(searchValue);
          if (found) {
            console.log('✅ Found in OpenFoodFacts by barcode:', found);
          } else {
            console.warn('❌ Product not found in OpenFoodFacts by barcode');
          }
        } catch (err) {
          console.error('❌ OpenFoodFacts barcode search error:', err);
        }
      }
      
      // Second try: OpenFoodFacts by name (if not found by barcode or not a barcode search)
      if (!found) {
        console.log(`🔍 [${isBarcodeSearch ? '2' : '1'}/3] Searching OpenFoodFacts by name...`);
        try {
          const results = await OpenFoodFactsService.searchProducts(searchValue);
          if (results && results.length > 0) {
            found = results[0];
            console.log('✅ Found in OpenFoodFacts by name:', found);
          } else {
            console.warn('❌ Product not found in OpenFoodFacts by name');
          }
        } catch (err) {
          console.error('❌ OpenFoodFacts product search error:', err);
        }
      }
      
      // Third try: Supabase fallback (if not found in OpenFoodFacts)
      if (!found && supabase) {
        console.log('🔍 [3/3] Falling back to Supabase search...');
        try {
          const { data, error: supaErr } = await supabase
            .from('supplements')
            .select('*')
            .or(`barcode.eq.${searchValue},product_name.ilike.%${searchValue}%`)
            .limit(1);
          
          console.log('📦 Supabase response:', { data, error: supaErr });
          
          if (!supaErr && data && data.length > 0) {
            found = data[0];
            console.log('✅ Found in Supabase:', found);
          } else {
            console.warn('❌ Product not found in Supabase');
          }
        } catch (err) {
          console.error('❌ Supabase search error:', err);
        }
      }
      
      if (!found) {
        console.log('❌ No product found in any source');
        throw new Error('No product found');
      }
      
      console.log('✅ Final product data:', found);
      setProduct(found);
      
      // Use test ingredients for debugging if needed
      // found.ingredients_text = "Vitamin C, Zinc, Elderberry Extract";
      
      // Only score if ingredients_text is long enough
      if (found.ingredients_text && found.ingredients_text.length >= 10) {
        console.log('🧪 Ingredients text length is sufficient, sending to OpenRouter...');
        console.log('📝 Ingredients text:', found.ingredients_text);
        
        setAiLoading(true);
        setAiWarning(null);
        
        try {
          const payload = {
            productName: found.product_name || '',
            brand: found.brands || '',
            ingredients: found.ingredients_text,
            categories: found.categories || '',
          };
          
          console.log('📤 Sending to OpenRouter:', payload);
          
          const aiScore = await OpenRouterService.evaluateSupplement(payload);
          console.log('📥 OpenRouter response:', aiScore);
          
          if (aiScore) {
            console.log('✅ AI Score:', aiScore.score, 'Summary:', aiScore.summary);
            setScore(aiScore);
          } else {
            console.warn('⚠️ Empty response from OpenRouter');
            setAiWarning('Received empty response from AI evaluation');
          }
        } catch (aiErr) {
          console.error('❌ OpenRouter error:', aiErr);
          setScore(null);
          setError('AI scoring failed. Check console for details.');
        } finally {
          setAiLoading(false);
        }
      } else {
        const warningMsg = !found.ingredients_text 
          ? 'No ingredients data available.' 
          : `Not enough data to evaluate (${found.ingredients_text.length} chars). Need at least 10.`;
          
        console.warn('⚠️ ' + warningMsg);
        console.log('Ingredients text:', found.ingredients_text);
        
        setScore(null);
        setAiWarning(warningMsg);
      }
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Sticky search bar */}
      <View className="flex-row items-center bg-white px-4 py-2 shadow-sm z-10">
              <Button title="Cancel" color={Colors.error} onPress={() => setScanning(false)} />
            </View>
          )}
        </View>
      ) : (
        <View style={{ marginBottom: 24, alignItems: 'center' }}>
          <Text style={{ color: Colors.subtext, marginBottom: 8 }}>Barcode scanning is only available on mobile.</Text>
          <Button title="Scan Barcode (Mobile Only)" disabled color={Colors.primary} />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Supplement Search</Text>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Enter UPC or product name"
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={() => handleSearch()}
        />
        <Button 
          title="Search" 
          onPress={() => handleSearch()}
          disabled={loading || !input.trim()} 
          color={Colors.primary}
        />
        {loading && <ActivityIndicator style={{ margin: 16 }} color={Colors.primary} />}
        {error && <Text style={styles.error}>{error}</Text>}
        {product && (
          <View style={styles.productBox}>
            <Text style={styles.productTitle}>{product.product_name || 'Unnamed Product'}</Text>
            {product.brands && <Text style={styles.productBrand}>{product.brands}</Text>}
            <Text style={styles.sectionTitle}>Ingredients:</Text>
            <Text style={styles.productIngredients}>
              {product.ingredients_text || 'No ingredients information available'}
            </Text>
            {aiWarning && (
              <Text style={styles.warning}>{aiWarning}</Text>
            )}
            {aiLoading && <ActivityIndicator style={{ margin: 10 }} color={Colors.primary} />}
            {score && !aiLoading && (
              <View style={styles.scoreBox}>
                <Text style={styles.scoreTitle}>AI Score</Text>
                <Text style={styles.scoreValue}>{score.score} / 100</Text>
                <Text style={styles.scoreSummary}>{score.summary}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: Colors.text,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: Colors.text,
  },
  error: {
    color: Colors.error,
    marginVertical: 12,
    textAlign: 'center',
  },
  productBox: {
    width: '100%',
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  productTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.text,
  },
  productBrand: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    color: Colors.text,
  },
  productIngredients: {
    fontSize: 15,
    marginBottom: 12,
    color: '#444',
    lineHeight: 22,
  },
  warning: {
    color: Colors.warning,
    marginVertical: 8,
    fontStyle: 'italic',
  },
  scoreBox: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#edf9f0',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2e7d32',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  scoreSummary: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  scanPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 8,
  },
  scanPromptText: {
    marginLeft: 8,
    color: Colors.primary,
    fontWeight: '500',
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scanFrame: {
    width: 250,
    height: 150,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    marginVertical: 20,
  },
  scanGuideText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 8,
  },
  cancelButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
    marginTop: 40,
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: 16,
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