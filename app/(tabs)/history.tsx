import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Platform } from 'react-native';
import { getWorkoutHistory } from '@/utils/storage';
import { WorkoutHistory } from '@/types';
import WorkoutHistoryCard from '../../components/WorkoutHistoryCard';
import Header from '@/components/Header';
import { useTheme } from '@/context/ThemeContext';
import { View, Text, ScrollView } from '@/components/Themed';

export default function HistoryScreen() {
  const { theme } = useTheme();  // Add theme support
  const [history, setHistory] = useState<WorkoutHistory[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const workoutHistory = await getWorkoutHistory();
        setHistory(workoutHistory);
      } catch (error) {
        console.error('Failed to load workout history:', error);
      }
    };

    loadHistory();
  }, []);

  // Group history by month
  const groupedHistory: Record<string, WorkoutHistory[]> = {};

  history.forEach(item => {
    const date = new Date(item.date);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    if (!groupedHistory[monthYear]) {
      groupedHistory[monthYear] = [];
    }

    groupedHistory[monthYear].push(item);
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Header title="Workout History" />

        <ScrollView
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {Object.keys(groupedHistory).length > 0 ? (
            Object.entries(groupedHistory).map(([monthYear, items]) => (
              <View key={monthYear}>
                <Text style={[styles.monthTitle, { color: theme.secondaryText }]}>{monthYear}</Text>

                {items.map(item => (
                  <WorkoutHistoryCard
                    key={item.id}
                    history={item}
                  />
                ))}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No Workout History</Text>
              <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
                Complete your first workout to see it here!
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 24 : 12,
    paddingBottom: 8,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});