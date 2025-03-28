import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { WorkoutHistory } from '../types';

interface WorkoutHistoryCardProps {
  history: WorkoutHistory;
}

export default function WorkoutHistoryCard({ history }: WorkoutHistoryCardProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handlePress = () => {
    router.push(`/workout/${history.workoutId}`);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{history.workoutName}</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Calendar size={16} color="#666" />
            <Text style={styles.detailText}>{formatDate(history.date)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Clock size={16} color="#666" />
            <Text style={styles.detailText}>{formatDuration(history.duration)}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{history.exercisesCompleted}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>

            {history.caloriesBurned !== undefined && (
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{history.caloriesBurned}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5757',
    fontFamily: 'Poppins-SemiBold',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Poppins-Regular',
  },
});