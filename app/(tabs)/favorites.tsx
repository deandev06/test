import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import { getExercises, getWorkoutPlans, toggleExerciseFavorite, toggleWorkoutPlanFavorite } from '../../utils/storage';
import { Exercise, WorkoutPlan } from '../../types';
import ExerciseCard from '../../components/ExerciseCard';
import WorkoutCard from '../../components/WorkoutCard';

export default function FavoritesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [activeTab, setActiveTab] = useState<'workouts' | 'exercises'>('workouts');

  useEffect(() => {
    const loadData = async () => {
      const loadedExercises = await getExercises();
      setExercises(loadedExercises.filter(ex => ex.isFavorite));
      
      const loadedWorkouts = await getWorkoutPlans();
      setWorkouts(loadedWorkouts.filter(w => w.isFavorite));
    };
    
    loadData();
  }, []);

  // Add a listener to refresh data when this screen is focused
  useEffect(() => {
    const refreshFavorites = async () => {
      const loadedExercises = await getExercises();
      setExercises(loadedExercises.filter(ex => ex.isFavorite));
      
      const loadedWorkouts = await getWorkoutPlans();
      setWorkouts(loadedWorkouts.filter(w => w.isFavorite));
    };

    // Initial load
    refreshFavorites();

    // Set up an interval to refresh data every 2 seconds
    const intervalId = setInterval(refreshFavorites, 2000);

    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleToggleExerciseFavorite = async (id: string) => {
    await toggleExerciseFavorite(id);
    const loadedExercises = await getExercises();
    setExercises(loadedExercises.filter(ex => ex.isFavorite));
  };

  const handleToggleWorkoutFavorite = async (id: string) => {
    await toggleWorkoutPlanFavorite(id);
    const loadedWorkouts = await getWorkoutPlans();
    setWorkouts(loadedWorkouts.filter(w => w.isFavorite));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Favorites</Text>
        </View>
        
        <View style={styles.tabContainer}>
          <View style={styles.tabButtons}>
            <Text
              style={[
                styles.tabButton,
                activeTab === 'workouts' && styles.activeTabButton
              ]}
              onPress={() => setActiveTab('workouts')}
            >
              Workouts
            </Text>
            <Text
              style={[
                styles.tabButton,
                activeTab === 'exercises' && styles.activeTabButton
              ]}
              onPress={() => setActiveTab('exercises')}
            >
              Exercises
            </Text>
          </View>
          <View style={styles.tabIndicatorContainer}>
            <View 
              style={[
                styles.tabIndicator,
                { left: activeTab === 'workouts' ? '0%' : '50%' }
              ]} 
            />
          </View>
        </View>
        
        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
          {activeTab === 'workouts' ? (
            <>
              {workouts.length > 0 ? (
                workouts.map(workout => (
                  <WorkoutCard 
                    key={workout.id}
                    workout={workout}
                    onToggleFavorite={handleToggleWorkoutFavorite}
                  />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>No Favorite Workouts</Text>
                  <Text style={styles.emptyText}>
                    Add workouts to your favorites by tapping the heart icon.
                  </Text>
                </View>
              )}
            </>
          ) : (
            <>
              {exercises.length > 0 ? (
                exercises.map(exercise => (
                  <ExerciseCard 
                    key={exercise.id}
                    exercise={exercise}
                    onToggleFavorite={handleToggleExerciseFavorite}
                  />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>No Favorite Exercises</Text>
                  <Text style={styles.emptyText}>
                    Add exercises to your favorites by tapping the heart icon.
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#333',
    fontFamily: 'Poppins-Bold',
  },
  tabContainer: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  tabButtons: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    fontFamily: 'Poppins-SemiBold',
  },
  activeTabButton: {
    color: '#FF5757',
  },
  tabIndicatorContainer: {
    height: 3,
    backgroundColor: '#f0f0f0',
    borderRadius: 1.5,
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: '#FF5757',
    borderRadius: 1.5,
    transition: 'left 0.3s ease',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
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
    color: '#333',
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 32,
  },
});