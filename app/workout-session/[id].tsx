import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { getWorkoutPlanById, getExerciseById, addWorkoutToHistory, saveCurrentSession, getCurrentSession, clearCurrentSession } from '@/utils/storage';
import { WorkoutPlan, Exercise, WorkoutSession, WorkoutHistory } from '@/types';
import Timer from '../../components/Timer';
import WorkoutControls from '../../components/WorkoutControls';
import { useTheme } from '@/context/ThemeContext';

export default function WorkoutSessionScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [exercises, setExercises] = useState<(Exercise | null)[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkout = async () => {
      if (id) {
        // Check if there's an existing session
        const savedSession = await getCurrentSession();

        if (savedSession && savedSession.workoutId === id) {
          // Resume the session
          setCurrentExerciseIndex(savedSession.currentExerciseIndex);
          setSessionStartTime(Date.now() - savedSession.elapsedTime);
          setElapsedTime(savedSession.elapsedTime);
          setIsPlaying(!savedSession.isPaused);
        } else {
          // Start a new session
          await clearCurrentSession();
        }

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

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying && !isResting) {
      interval = setInterval(() => {
        const newElapsedTime = Date.now() - sessionStartTime;
        setElapsedTime(newElapsedTime);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isResting, sessionStartTime]);

  useEffect(() => {
    // Save session state whenever it changes
    const saveSession = async () => {
      if (workout) {
        const session: WorkoutSession = {
          workoutId: workout.id,
          currentExerciseIndex,
          startTime: sessionStartTime,
          elapsedTime,
          isPaused: !isPlaying,
          pauseStartTime: !isPlaying ? Date.now() : undefined,
        };

        await saveCurrentSession(session);
      }
    };

    saveSession();
  }, [workout, currentExerciseIndex, sessionStartTime, elapsedTime, isPlaying]);

  const handlePlay = () => {
    if (!isPlaying) {
      // Adjust start time to account for pause duration
      const pauseDuration = Date.now() - (sessionStartTime + elapsedTime);
      setSessionStartTime(sessionStartTime + pauseDuration);
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleSkip = () => {
    if (workout) {
      if (currentExerciseIndex < workout.exercises.length - 1) {
        // Move to the next exercise
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setIsResting(false);
      } else {
        // Already at the last exercise, end the workout
        endWorkout();
      }
    }
  };

  const handleStop = () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to end this workout?')) {
        endWorkout();
      }
    } else {
      Alert.alert(
        'End Workout',
        'Are you sure you want to end this workout?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'End', style: 'destructive', onPress: endWorkout }
        ]
      );
    }
  };

  const endWorkout = async () => {
    if (workout) {
      // Save to workout history
      const history: WorkoutHistory = {
        id: Date.now().toString(),
        workoutId: workout.id,
        workoutName: workout.name,
        date: new Date().toISOString(),
        duration: Math.floor(elapsedTime / 1000),
        exercisesCompleted: currentExerciseIndex + 1,
        caloriesBurned: Math.floor(elapsedTime / 1000 / 60 * 5), // Rough estimate: 5 calories per minute
      };

      await addWorkoutToHistory(history);
      await clearCurrentSession();

      router.replace('/history');
    }
  };

  const handleExerciseComplete = () => {
    if (workout) {
      const currentExercise = workout.exercises[currentExerciseIndex];

      if (currentExercise.restAfter > 0) {
        // Start rest period
        setIsResting(true);
        setRestTimeLeft(currentExercise.restAfter);
      } else if (currentExerciseIndex < workout.exercises.length - 1) {
        // Move to next exercise
        setCurrentExerciseIndex(currentExerciseIndex + 1);
      } else {
        // Workout complete
        endWorkout();
      }
    }
  };

  const handleRestComplete = () => {
    setIsResting(false);

    if (workout && currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // Workout complete
      endWorkout();
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.secondaryText }]}>Loading workout...</Text>
      </View>
    );
  }

  if (!workout || exercises.length === 0) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.secondaryText }]}>Workout not found</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentWorkoutExercise = workout.exercises[currentExerciseIndex];
  const currentExercise = exercises[currentExerciseIndex];

  if (!currentExercise || !currentWorkoutExercise) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.secondaryText }]}>Exercise data not found</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: theme.inputBackground }]}
            onPress={handleStop}
          >
            <X size={24} color={theme.secondaryText} />
          </TouchableOpacity>

          <View style={styles.workoutInfo}>
            <Text style={[styles.workoutName, { color: theme.text }]}>{workout.name}</Text>
            <Text style={[styles.workoutTimer, { color: theme.secondaryText }]}>
              {formatTime(elapsedTime)}
            </Text>
          </View>

          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {isResting ? (
            <View style={styles.restContainer}>
              <Text style={[styles.restTitle, { color: theme.text }]}>Rest Time</Text>
              <Timer
                duration={restTimeLeft}
                isRunning={isPlaying}
                onComplete={handleRestComplete}
              />
              <Text style={[styles.restText, { color: theme.secondaryText }]}>
                Next: {currentExerciseIndex + 1 < exercises.length ? exercises[currentExerciseIndex + 1]?.name : 'Workout Complete'}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.exerciseProgress}>
                <Text style={[styles.exerciseCount, { color: theme.secondaryText }]}>
                  {currentExerciseIndex + 1} / {workout.exercises.length}
                </Text>
              </View>

              <View style={styles.exerciseContainer}>
                <Image
                  source={{ uri: currentExercise.imageUrl }}
                  style={styles.exerciseImage}
                  resizeMode="cover"
                />

                <Text style={[styles.exerciseName, { color: theme.text }]}>{currentExercise.name}</Text>

                {currentWorkoutExercise.duration ? (
                  <Timer
                    duration={currentWorkoutExercise.duration}
                    isRunning={isPlaying}
                    onComplete={handleExerciseComplete}
                  />
                ) : (
                  <View style={styles.repsContainer}>
                    <Text style={[styles.repsText, { color: theme.text }]}>
                      {currentWorkoutExercise.repetitions} reps × {currentWorkoutExercise.sets} sets
                    </Text>
                    <TouchableOpacity
                      style={styles.doneButton}
                      onPress={handleExerciseComplete}
                    >
                      <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </>
          )}
        </View>

        <WorkoutControls
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onSkip={handleSkip}
          onStop={handleStop}
        />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 24 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FF5757',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  workoutInfo: {
    alignItems: 'center',
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  workoutTimer: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  exerciseProgress: {
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseCount: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  exerciseContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 24,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  repsContainer: {
    alignItems: 'center',
  },
  repsText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    fontFamily: 'Poppins-SemiBold',
  },
  doneButton: {
    backgroundColor: '#FF5757',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  restContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    fontFamily: 'Poppins-Bold',
  },
  restText: {
    fontSize: 16,
    marginTop: 24,
    fontFamily: 'Poppins-Regular',
  },
});