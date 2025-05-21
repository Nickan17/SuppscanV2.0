import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import ScoreProgressBar from './ScoreProgressBar';

interface QualityScoreCardProps {
  score: number;
  clinicalDosing: number;
  thirdPartyTesting: number;
  brandTransparency: number;
}

export default function QualityScoreCard({
  score,
  clinicalDosing,
  thirdPartyTesting,
  brandTransparency,
}: QualityScoreCardProps) {
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return Colors.success;
    if (score >= 60) return Colors.warning;
    return Colors.error;
  };

  const scoreColor = getScoreColor(score);

  return (
    <View style={styles.container}>
      <View style={styles.scoreCircleContainer}>
        <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
          <Text style={[styles.scoreText, { color: scoreColor }]}>{score}</Text>
          <Text style={styles.outOfText}>/100</Text>
        </View>
        <Text style={styles.qualityText}>Quality Score</Text>
      </View>

      <View style={styles.breakdownContainer}>
        <Text style={styles.breakdownTitle}>Score Breakdown</Text>

        <View style={styles.scoreItem}>
          <View style={styles.scoreItemHeader}>
            <Ionicons name="flask-outline" size={20} color={Colors.text} />
            <Text style={styles.scoreItemTitle}>Clinical Dosing Match</Text>
          </View>
          <ScoreProgressBar
            value={clinicalDosing}
            color={getScoreColor(clinicalDosing)}
          />
        </View>

        <View style={styles.scoreItem}>
          <View style={styles.scoreItemHeader}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={Colors.text}
            />
            <Text style={styles.scoreItemTitle}>Third-Party Testing</Text>
          </View>
          <ScoreProgressBar
            value={thirdPartyTesting}
            color={getScoreColor(thirdPartyTesting)}
          />
        </View>

        <View style={styles.scoreItem}>
          <View style={styles.scoreItemHeader}>
            <Ionicons name="eye-outline" size={20} color={Colors.text} />
            <Text style={styles.scoreItemTitle}>Brand Transparency</Text>
          </View>
          <ScoreProgressBar
            value={brandTransparency}
            color={getScoreColor(brandTransparency)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  scoreCircleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.background,
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  outOfText: {
    fontSize: 14,
    color: Colors.subtext,
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  qualityText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  breakdownContainer: {
    marginTop: 8,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  scoreItem: {
    marginBottom: 16,
  },
  scoreItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: 8,
  },
});
