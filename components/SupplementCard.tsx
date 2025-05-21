import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Supplement } from '@/types';

interface SupplementCardProps {
  supplement: Supplement;
  onPress: () => void;
}

export default function SupplementCard({
  supplement,
  onPress,
}: SupplementCardProps) {
  const { name, brand, imageUrl, qualityScore, category } = supplement;

  const getScoreColor = (score: number) => {
    if (score >= 80) return Colors.success;
    if (score >= 60) return Colors.warning;
    return Colors.error;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.brand}>{brand}</Text>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.category}>{category}</Text>
        <View style={styles.scoreContainer}>
          <View
            style={[
              styles.scoreCircle,
              { backgroundColor: getScoreColor(qualityScore) },
            ]}
          >
            <Text style={styles.scoreValue}>{qualityScore}</Text>
          </View>
          <Text style={styles.scoreLabel}>Quality Score</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.subtext} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  brand: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 2,
  },
  category: {
    fontSize: 13,
    color: Colors.subtext,
    marginTop: 2,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  scoreCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 13,
    color: Colors.text,
    marginLeft: 8,
    fontWeight: '500',
  },
});
