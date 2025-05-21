import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import Colors from '@/constants/Colors';
import QualityScoreCard from '@/components/QualityScoreCard';
import AISummary from '@/components/AISummary';
import { getSupplementData } from '@/utils/supplementData';
import { Supplement } from '@/types/supplement';

export default function ResultsScreen() {
  const router = useRouter();
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const [product, setProduct] = useState<Supplement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!barcode) {
        setError('No barcode provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const productData = await getSupplementData(barcode);
        setProduct(productData);

        if (productData.error === 'insufficient_ingredients') {
          Alert.alert(
            'Insufficient Ingredient Data',
            'We need more ingredient detail to give an accurate score.',
          );
        } else if (productData.error) {
          setError('Failed to analyze product');
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product data');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [barcode]);

  if (isLoading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Analyzing product...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={48} color={Colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quality Analysis</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.productSection}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.productImage}
            resizeMode="contain"
          />
          <View style={styles.productInfo}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.category}>{product.category}</Text>
          </View>
        </View>

        <QualityScoreCard
          score={product.qualityScore}
          clinicalDosing={product.scores.clinicalDosing}
          thirdPartyTesting={product.scores.thirdPartyTesting}
          brandTransparency={product.scores.brandTransparency}
        />

        <AISummary summary={product.aiSummary} />

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="bookmark-outline"
              size={20}
              color={Colors.background}
            />
            <Text style={styles.actionButtonText}>Save to History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
          >
            <Ionicons name="share-outline" size={20} color={Colors.primary} />
            <Text style={styles.secondaryButtonText}>Share Results</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ingredientsContainer}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {product.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Text style={styles.ingredientName}>{ingredient.name}</Text>
              <Text style={styles.ingredientDosage}>{ingredient.dosage}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  productSection: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.background,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  brand: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 4,
  },
  category: {
    fontSize: 14,
    color: Colors.subtext,
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  secondaryButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginRight: 0,
    marginLeft: 8,
  },
  actionButtonText: {
    color: Colors.background,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  ingredientsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  ingredientName: {
    fontSize: 16,
    color: Colors.text,
  },
  ingredientDosage: {
    fontSize: 16,
    color: Colors.subtext,
    fontWeight: '500',
  },
});
