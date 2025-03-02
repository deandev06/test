import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Play } from 'lucide-react-native';
import { getExercises, getWorkoutPlans, toggleExerciseFavorite, toggleWorkoutPlanFavorite } from '../../utils/storage';
import { initializeAppData } from '../../utils/dataInitializer';
import { Exercise, WorkoutPlan } from '../../types';
import ExerciseCard from '../../components/ExerciseCard';
import WorkoutCard from '../../components/WorkoutCard';
import SearchBar from '../../components/SearchBar';
import CategoryFilter from '../../components/CategoryFilter';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [featuredWorkout, setFeaturedWorkout] = useState<WorkoutPlan | null>(null);

  useEffect(() => {
    const loadData = async () => {
      await initializeAppData();

      const loadedExercises = await getExercises();
      setExercises(loadedExercises);

      const loadedWorkouts = await getWorkoutPlans();
      setWorkouts(loadedWorkouts);

      // Set a random workout as featured
      if (loadedWorkouts.length > 0) {
        const randomIndex = Math.floor(Math.random() * loadedWorkouts.length);
        setFeaturedWorkout(loadedWorkouts[randomIndex]);
      }
    };

    loadData();
  }, []);

  const handleToggleExerciseFavorite = async (id: string) => {
    await toggleExerciseFavorite(id);
    const updatedExercises = await getExercises();
    setExercises(updatedExercises);
  };

  const handleToggleWorkoutFavorite = async (id: string) => {
    await toggleWorkoutPlanFavorite(id);
    const updatedWorkouts = await getWorkoutPlans();
    setWorkouts(updatedWorkouts);

    // Update featured workout if it was the one toggled
    if (featuredWorkout && featuredWorkout.id === id) {
      const updatedFeatured = updatedWorkouts.find(w => w.id === id);
      if (updatedFeatured) {
        setFeaturedWorkout(updatedFeatured);
      }
    }
  };

  const handleStartFeaturedWorkout = () => {
    if (featuredWorkout) {
      router.push(`/workout-session/${featuredWorkout.id}`);
    }
  };

  const exerciseCategories = [...new Set(exercises.map(ex => ex.category))];

  const filteredExercises = exercises
    .filter(ex =>
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(ex => selectedCategory ? ex.category === selectedCategory : true)
    .slice(0, 3); // Reduced from 6 to 3 exercises

  // Filter workouts similar to exercises
  const filteredWorkouts = workouts
    .filter(w =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(w => featuredWorkout ? w.id !== featuredWorkout.id : true) // Exclude featured workout
    .slice(0, 3); // Show only 3 workouts

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.title}>Ready to workout?</Text>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search exercises or workouts..."
        />

        {featuredWorkout && (
          <View style={styles.featuredContainer}>
            <Text style={styles.sectionTitle}>Featured Workout</Text>
            <WorkoutCard
              workout={featuredWorkout}
              onToggleFavorite={handleToggleWorkoutFavorite}
            />
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartFeaturedWorkout}
            >
              <Play size={20} color="#fff" />
              <Text style={styles.startButtonText}>Start Workout</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.exercisesContainer}>
          <Text style={styles.sectionTitle}>Exercises</Text>

          <CategoryFilter
            categories={exerciseCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {filteredExercises.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onToggleFavorite={handleToggleExerciseFavorite}
            />
          ))}

          {filteredExercises.length === 0 && (
            <Text style={styles.emptyText}>No exercises found</Text>
          )}

          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => router.push('/workouts')}
          >
            <Text style={styles.viewAllText}>View All Exercises</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.workoutsContainer}>
          <Text style={styles.sectionTitle}>Workouts</Text>

          {filteredWorkouts.map(workout => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onToggleFavorite={handleToggleWorkoutFavorite}
            />
          ))}

          {filteredWorkouts.length === 0 && (
            <Text style={styles.emptyText}>No additional workouts found</Text>
          )}

          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => router.push('/workouts')}
          >
            <Text style={styles.viewAllText}>View All Workouts</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  greeting: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'Poppins-Bold',
  },
  featuredContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  startButton: {
    backgroundColor: '#FF5757',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  exercisesContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 0,
  },
  workoutsContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginVertical: 24,
    fontFamily: 'Poppins-Regular',
  },
  viewAllButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  viewAllText: {
    color: '#FF5757',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});