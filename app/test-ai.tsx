import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function TestAIPage() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>AI Evaluation</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          This is a placeholder for the AI evaluation feature. In the full
          version, this will analyze supplement ingredients and provide health
          insights.
        </Text>

        <View style={styles.featureList}>
          <Text style={styles.featureTitle}>Coming Soon:</Text>
          <Text style={styles.feature}>• Ingredient analysis</Text>
          <Text style={styles.feature}>• Health impact assessment</Text>
          <Text style={styles.feature}>• Personalized recommendations</Text>
        </View>
      </View>
    </View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 24,
  },
  featureList: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  feature: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginLeft: 8,
  },
});
