import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TestOpenRouterProps {
  productName: string;
}

const TestOpenRouter: React.FC<TestOpenRouterProps> = ({ productName }) => {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productName) return;

    let isMounted = true;

    const fetchAI = async () => {
      setLoading(true);
      setError(null);
      setResponse(null);

      try {
        // For demo purposes, just show a mock response
        const mockResponse = `**Total Score**: 85/100

**Breakdown**:
- Ingredient Transparency: 20/20
- Clinical Doses: 12/15
- Bioavailability: 8/10
- Third-Party Testing: 15/15
- Additives & Fillers: 8/10
- Label Accuracy: 9/10
- Manufacturing Standards: 10/10
- Brand Reputation: 4/5
- Verified Reviews: 4/5

**Summary**:
This is a high-quality supplement with good ingredient transparency and manufacturing standards.`;

        if (isMounted) {
          setResponse(mockResponse);
          console.log('Mock AI Evaluation:', {
            productName: productName,
            upc: '',
            score: 85,
            summary: 'Mock evaluation for demo purposes',
          });
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e.message || 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAI();

    return () => {
      isMounted = false;
    };
  }, [productName]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading evaluation...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  if (!response) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.resultBox}>
        <Text style={styles.resultTitle}>AI Score for {productName}</Text>
        <Text style={styles.resultText}>{response}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  resultBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 14,
    lineHeight: 20,
  },
  error: {
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
});
