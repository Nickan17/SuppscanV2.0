import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface ScoreProgressBarProps {
  value: number;
  color: string;
}

export default function ScoreProgressBar({ value, color }: ScoreProgressBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <View 
          style={[
            styles.barFill, 
            { width: `${value}%`, backgroundColor: color }
          ]} 
        />
      </View>
      <Text style={[styles.valueText, { color }]}>{value}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barBackground: {
    flex: 1,
    height: 10,
    backgroundColor: Colors.lightGray,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  valueText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
});