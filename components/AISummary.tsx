import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface AISummaryProps {
  summary: string;
}

export default function AISummary({ summary }: AISummaryProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="flash" size={20} color={Colors.accent} />
          <Text style={styles.title}>AI Analysis</Text>
        </View>
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          style={styles.expandButton}
        >
          <Ionicons 
            name={expanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={Colors.text} 
          />
        </TouchableOpacity>
      </View>
      
      <Text 
        style={styles.summary}
        numberOfLines={expanded ? undefined : 3}
      >
        {summary}
      </Text>
      
      {!expanded && (
        <TouchableOpacity 
          style={styles.readMore} 
          onPress={() => setExpanded(true)}
        >
          <Text style={styles.readMoreText}>Read more</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  expandButton: {
    padding: 4,
  },
  summary: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
  },
  readMore: {
    marginTop: 8,
  },
  readMoreText: {
    color: Colors.primary,
    fontWeight: '500',
  },
});