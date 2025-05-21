import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
// Mock implementations since we're having issues with the actual services
const evaluateSupplement = async (
  ingredients: string,
): Promise<Evaluation> => ({
  score: 4,
  final_score: 4,
  reasons: ['Contains beneficial ingredients', 'No artificial colors detected'],
  summary: 'This product appears to be a good choice based on its ingredients.',
  ingredients: {},
  category_breakdown: {
    Purity: { score: 4, reason: 'High quality ingredients' },
    Efficacy: { score: 4, reason: 'Effective formulation' },
    Safety: { score: 5, reason: 'No harmful additives' },
  },
});

const logSupplementEvaluation = async (data: any) => {
  console.log('Logging evaluation:', data);
  return { success: true };
};

interface SearchScreenProps {
  onSearch: (query: string, isUPC?: boolean) => Promise<Product | null>;
}

interface Evaluation {
  score: number;
  final_score: number;
  reasons: string[];
  summary?: string;
  ingredients?: Record<string, any>;
  category_breakdown?: Record<string, { score: number; reason: string }>;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  ingredients: string;
  image?: string;
  barcode: string;
  product_name?: string;
  product_name_en?: string;
  brands?: string;
  ingredients_text?: string;
  code?: string;
}

const getScoreColor = (score: number | undefined): string => {
  const safeScore = score || 0;
  if (safeScore >= 4) return Colors.primary;
  if (safeScore >= 3) return Colors.warning;
  return Colors.error; // Using 'error' instead of 'danger' to match Colors type
};

export default function SearchScreen({ onSearch }: SearchScreenProps) {
  const [productName, setProductName] = useState('');
  const [upc, setUpc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [evaluation, setEvaluation] = useState<Partial<Evaluation> | null>(
    null,
  );
  const [showDetails, setShowDetails] = useState(false);

  const handleSearch = async () => {
    if (!productName && !upc) {
      Alert.alert(
        'Search Error',
        'Please enter a product name, brand, or UPC.',
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const product = await onSearch(productName || '', !!upc);

      if (!product) {
        Alert.alert('Search Error', 'Product not found. Please try again.');
        return;
      }

      setProduct(product);
      setIsLoading(false);

      const handleEvaluate = async (product: Product): Promise<Evaluation> => {
        setIsEvaluating(true);
        setError(null);

        try {
          // Pass just the ingredients string to evaluateSupplement
          const evaluation = await evaluateSupplement(product.ingredients);

          // Ensure evaluation has required properties
          const safeEvaluation: Evaluation = {
            score: evaluation.score || 0,
            final_score: evaluation.final_score || evaluation.score || 0,
            reasons: evaluation.reasons || [],
            summary: evaluation.summary || 'No summary available',
            ingredients: evaluation.ingredients || {},
            category_breakdown: evaluation.category_breakdown || {},
          };

          setEvaluation(safeEvaluation);

          // Log the evaluation
          await logSupplementEvaluation({
            productId: product.id,
            evaluation: safeEvaluation,
          });

          return safeEvaluation;
        } catch (error) {
          console.error('Error:', error);
          const errorMessage =
            error instanceof Error ? error.message : 'An error occurred';
          setError(errorMessage);
          setEvaluation(null);
          throw new Error(errorMessage);
        } finally {
          setIsEvaluating(false);
        }
      };

      await handleEvaluate(product);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setEvaluation(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="search"
            size={20}
            color={Colors.subtext}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter product name or brand"
            value={productName}
            onChangeText={setProductName}
            placeholderTextColor={Colors.subtext}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons
            name="barcode"
            size={20}
            color={Colors.subtext}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter UPC code (optional)"
            value={upc}
            onChangeText={setUpc}
            placeholderTextColor={Colors.subtext}
            keyboardType="number-pad"
          />
        </View>

        <Button
          title={isLoading ? 'Searching...' : 'Search'}
          onPress={handleSearch}
          disabled={isLoading || (!productName && !upc)}
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
        </View>
      )}

      {product && !error && (
        <View style={styles.productCard}>
          {product.image && (
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="contain"
            />
          )}
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productBrand}>Brand: {product.brand}</Text>

          {isEvaluating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading AI Evaluation...</Text>
            </View>
          ) : evaluation ? (
            <View style={styles.detailsContainer}>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>
                  {evaluation.final_score || evaluation.score || 0}/100
                </Text>
                <View
                  style={[
                    styles.scoreCircle,
                    {
                      backgroundColor: getScoreColor(
                        evaluation.final_score || evaluation.score || 0,
                      ),
                    },
                  ]}
                >
                  <Text style={styles.scoreNumber}>
                    {evaluation.final_score || evaluation.score || 0}
                  </Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Summary</Text>
              <Text style={styles.evaluationText}>
                {evaluation.summary || 'No summary available'}
              </Text>

              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => setShowDetails(!showDetails)}
              >
                <Text style={styles.detailsButtonText}>
                  {showDetails ? 'Hide Details' : 'See Full Analysis'}
                </Text>
              </TouchableOpacity>

              {showDetails && (
                <View style={styles.detailsContainer}>
                  <Text style={styles.sectionTitle}>Ingredient Analysis</Text>
                  {evaluation.ingredients &&
                    Object.entries(evaluation.ingredients).map(
                      ([ingredient, details], index) => (
                        <View key={index} style={styles.ingredientRow}>
                          <Text style={styles.ingredientName}>
                            {ingredient}
                          </Text>
                          {details && typeof details === 'object' ? (
                            <Text style={styles.ingredientNotes}>
                              {Object.entries(details).map(([key, value]) => (
                                <Text key={key}>
                                  {key}:{' '}
                                  {typeof value === 'string'
                                    ? value
                                    : JSON.stringify(value)}
                                  \n
                                </Text>
                              ))}
                            </Text>
                          ) : (
                            <Text style={styles.ingredientNotes}>
                              {typeof details === 'string'
                                ? details
                                : JSON.stringify(details)}
                            </Text>
                          )}
                        </View>
                      ),
                    )}

                  <Text style={styles.sectionTitle}>Category Breakdown</Text>
                  {evaluation.category_breakdown &&
                    Object.entries(evaluation.category_breakdown).map(
                      ([category, data]) => {
                        const breakdown = data as {
                          score: number;
                          reason: string;
                        };
                        return (
                          <View key={category} style={styles.categoryRow}>
                            <Text style={styles.categoryName}>{category}:</Text>
                            <Text style={styles.categoryScore}>
                              {breakdown.score}
                            </Text>
                            <Text style={styles.categoryReason}>
                              {breakdown.reason}
                            </Text>
                          </View>
                        );
                      },
                    )}
                </View>
              )}
            </View>
          ) : null}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    gap: 12,
    padding: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: Colors.text,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  loading: {
    marginTop: 20,
  },
  error: {
    color: Colors.error,
    textAlign: 'center',
    marginTop: 10,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginHorizontal: 16,
  },
  productCard: {
    width: '100%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productBrand: {
    fontSize: 16,
    color: Colors.subtext,
    marginBottom: 12,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    marginTop: 16,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailsButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    marginRight: 8,
  },
  detailsButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  detailsContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ingredientRow: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 8,
  },
  ingredientName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ingredientNotes: {
    color: Colors.subtext,
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  categoryName: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  categoryScore: {
    fontWeight: 'bold',
    color: Colors.primary,
    marginRight: 8,
  },
  categoryReason: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.text,
  },
  evaluationText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
});
