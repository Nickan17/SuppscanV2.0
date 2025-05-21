import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { OpenRouterService } from '@/services/openRouter';
import { supabase } from '@/lib/supabase';

interface EvaluationResult {
  score: number;
  summary: string;
  ingredients: string[];
  category_breakdown: Record<string, { score: number; reason: string }>;
}

export default function ProductDetailScreen() {
  const { product: productStr } = useLocalSearchParams<{ product: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Parse the product data
  const product = productStr ? JSON.parse(productStr) : null;

  useEffect(() => {
    if (product) {
      evaluateProduct();
    }
  }, [product]);

  const evaluateProduct = async () => {
    if (!product) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check if we already have an evaluation for this product
      const { data: existingEval } = await supabase
        .from('evaluations')
        .select('*')
        .eq('product_id', product.code)
        .single();

      if (existingEval) {
        setEvaluation(existingEval.result);
        return;
      }

      // If no existing evaluation, generate a new one
      const result = await OpenRouterService.evaluateSupplement({
        productName: product.product_name || 'Unknown Product',
        brand: product.brands || 'Unknown Brand',
        ingredients: product.ingredients_text || '',
        categories: product.categories || '',
      });

      // Save the evaluation to Supabase
      await supabase.from('evaluations').insert([
        {
          product_id: product.code,
          product_name: product.product_name,
          brand: product.brands,
          result,
        },
      ]);

      setEvaluation(result);
    } catch (err) {
      console.error('Error evaluating product:', err);
      setError('Failed to evaluate product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderScoreCircle = (score: number) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    // Determine color based on score
    let color = '#4CAF50'; // Green
    if (score < 50)
      color = '#F44336'; // Red
    else if (score < 75) color = '#FFC107'; // Yellow

    return (
      <View style={styles.scoreContainer}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#eee"
            strokeWidth="12"
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
          />
        </svg>
        <Text style={[styles.scoreText, { color }]}>{Math.round(score)}</Text>
      </View>
    );
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.product_name || 'Product Details'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {product.image_url ? (
          <Image
            source={{ uri: product.image_url }}
            style={styles.productImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.noImage}>
            <MaterialIcons name="image-not-supported" size={40} color="#ccc" />
            <Text style={styles.noImageText}>No image available</Text>
          </View>
        )}

        <View style={styles.detailsContainer}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.product_name || 'Unknown Product'}
          </Text>
          {product.brands && (
            <Text style={styles.brandName} numberOfLines={1}>
              {product.brands}
            </Text>
          )}

          {product.nutriscore_grade && (
            <View style={styles.nutriScoreContainer}>
              <Text style={styles.sectionTitle}>Nutri-Score</Text>
              <View style={styles.nutriScore}>
                {['a', 'b', 'c', 'd', 'e'].map((grade) => (
                  <View
                    key={grade}
                    style={[
                      styles.nutriScoreGrade,
                      grade === product.nutriscore_grade?.toLowerCase() &&
                        styles.nutriScoreActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.nutriScoreText,
                        grade === product.nutriscore_grade?.toLowerCase() &&
                          styles.nutriScoreTextActive,
                      ]}
                    >
                      {grade.toUpperCase()}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Analyzing product...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={40} color="#F44336" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={evaluateProduct}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : evaluation ? (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Supplement Score</Text>
                {renderScoreCircle(evaluation.score)}
                <Text style={styles.scoreDescription}>
                  {evaluation.summary || 'No summary available.'}
                </Text>
              </View>

              {evaluation.ingredients && evaluation.ingredients.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Key Ingredients</Text>
                  <View style={styles.ingredientsContainer}>
                    {evaluation.ingredients.map((ingredient, index) => (
                      <View key={index} style={styles.ingredientTag}>
                        <Text style={styles.ingredientText}>{ingredient}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {evaluation.category_breakdown && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Category Breakdown</Text>
                  {Object.entries(evaluation.category_breakdown).map(
                    ([category, data]) => (
                      <View key={category} style={styles.categoryItem}>
                        <View style={styles.categoryHeader}>
                          <Text style={styles.categoryName}>
                            {category} ({data.score}/10)
                          </Text>
                        </View>
                        <Text style={styles.categoryReason}>{data.reason}</Text>
                      </View>
                    ),
                  )}
                </View>
              )}
            </>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  content: {
    paddingBottom: 24,
  },
  productImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#f9f9f9',
  },
  noImage: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  noImageText: {
    marginTop: 8,
    color: '#999',
    fontSize: 14,
  },
  detailsContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  brandName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  scoreText: {
    position: 'absolute',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    top: '50%',
    transform: [{ translateY: -16 }],
    width: '100%',
  },
  scoreDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  ingredientTag: {
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  ingredientText: {
    color: '#1976d2',
    fontSize: 14,
  },
  categoryItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  categoryScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  categoryReason: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nutriScoreContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  nutriScore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  nutriScoreGrade: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nutriScoreActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  nutriScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  nutriScoreTextActive: {
    color: '#fff',
  },
});
