import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Heart, ArrowLeft, Clock, BarChart3, Play, Dumbbell } from 'lucide-react-native';
import { getWorkoutPlanById, getExerciseById, toggleWorkoutPlanFavorite } from '../../utils/storage';
import { WorkoutPlan, Exercise } from '../../types';
import { useTheme } from '@/context/ThemeContext';

export default function WorkoutDetailScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [exercises, setExercises] = useState<(Exercise | null)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkout = async () => {
      if (id) {
        const workoutData = await getWorkoutPlanById(id);
        setWorkout(workoutData);

        if (workoutData) {
          const exercisePromises = workoutData.exercises.map(ex =>
            getExerciseById(ex.exerciseId)
          );
          const exerciseData = await Promise.all(exercisePromises);
          setExercises(exerciseData);
        }
      }
      setLoading(false);
    };

    loadWorkout();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (workout) {
      await toggleWorkoutPlanFavorite(workout.id);
      const updatedWorkout = await getWorkoutPlanById(workout.id);
      setWorkout(updatedWorkout);
    }
  };

  const handleStartWorkout = () => {
    if (workout) {
      router.push(`/workout-session/${workout.id}`);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.secondaryText }]}>Loading...</Text>
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.secondaryText }]}>Workout not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: workout.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleToggleFavorite}
            >
              <Heart
                size={24}
                color="#fff"
                fill={workout.isFavorite ? '#fff' : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: theme.text }]}>{workout.name}</Text>

          <View style={styles.tagsContainer}>
            <View style={[styles.tag, { backgroundColor: theme.inputBackground }]}>
              <Clock size={16} color={theme.secondaryText} />
              <Text style={[styles.tagText, { color: theme.secondaryText }]}>{workout.duration} min</Text>
            </View>

            <View style={[styles.tag, { backgroundColor: theme.inputBackground }]}>
              <BarChart3 size={16} color={theme.secondaryText} />
              <Text style={[styles.tagText, { color: theme.secondaryText }]}>{workout.difficultyLevel}</Text>
            </View>

            <View style={[styles.tag, { backgroundColor: theme.inputBackground }]}>
              <Dumbbell size={16} color={theme.secondaryText} />
              <Text style={[styles.tagText, { color: theme.secondaryText }]}>{workout.category}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
            <Text style={[styles.description, { color: theme.secondaryText }]}>{workout.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Exercises</Text>
            {workout.exercises.map((workoutExercise, index) => {
              const exercise = exercises[index];
              if (!exercise) return null;

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.exerciseItem, { backgroundColor: theme.inputBackground }]}
                  onPress={() => router.push(`/exercise/${exercise.id}`)}
                >
                  <Image
                    source={{ uri: exercise.imageUrl }}
                    style={styles.exerciseImage}
                    resizeMode="cover"
                  />
                  <View style={styles.exerciseContent}>
                    <Text style={[styles.exerciseName, { color: theme.text }]}>{exercise.name}</Text>
                    <View style={styles.exerciseDetails}>
                      {workoutExercise.duration ? (
                        <Text style={[styles.exerciseDetail, { color: theme.secondaryText }]}>
                          {workoutExercise.duration} sec
                        </Text>
                      ) : (
                        <Text style={[styles.exerciseDetail, { color: theme.secondaryText }]}>
                          {workoutExercise.repetitions} reps × {workoutExercise.sets} sets
                        </Text>
                      )}
                      <Text style={[styles.exerciseDetail, { color: theme.secondaryText }]}>
                        Rest: {workoutExercise.restAfter} sec
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.startButtonContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartWorkout}
        >
          <Play size={20} color="#fff" />
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'web' ? 24 : 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FF5757',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80, // Space for the start button
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
  exerciseItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      },
      default: {
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
    }),
  },
  exerciseImage: {
    width: 80,
    height: 80,
  },
  exerciseContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exerciseDetail: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  startButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  startButton: {
    backgroundColor: '#FF5757',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Poppins-SemiBold',
  },
});