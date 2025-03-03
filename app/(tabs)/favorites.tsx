import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform, Dimensions } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { getExercises, getWorkoutPlans, toggleExerciseFavorite, toggleWorkoutPlanFavorite } from '../../utils/storage';
import { Exercise, WorkoutPlan } from '../../types';
import ExerciseCard from '../../components/ExerciseCard';
import WorkoutCard from '../../components/WorkoutCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FavoritesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [activeTab, setActiveTab] = useState<'workouts' | 'exercises'>('workouts');

  // For swipe animation
  const translateX = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);

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

  const changeTab = (tab: 'workouts' | 'exercises') => {
    setActiveTab(tab);
    // Reset scroll position when changing tabs
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  // Set up the gesture handler
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      // Calculate the new position with limits
      const newPosition = ctx.startX + event.translationX;
      // Limit the drag to prevent going too far
      if (newPosition < -SCREEN_WIDTH && activeTab === 'workouts') {
        translateX.value = -SCREEN_WIDTH;
      } else if (newPosition > 0 && activeTab === 'exercises') {
        translateX.value = 0;
      } else {
        translateX.value = newPosition;
      }
    },
    onEnd: (event) => {
      // If swiped significantly to the left or right, change tabs
      if (event.velocityX < -500 || (event.translationX < -SCREEN_WIDTH / 3 && activeTab === 'workouts')) {
        translateX.value = withTiming(-SCREEN_WIDTH);
        runOnJS(changeTab)('exercises');
      } else if (event.velocityX > 500 || (event.translationX > SCREEN_WIDTH / 3 && activeTab === 'exercises')) {
        translateX.value = withTiming(0);
        runOnJS(changeTab)('workouts');
      } else {
        // Otherwise snap back to current tab
        translateX.value = withTiming(activeTab === 'workouts' ? 0 : -SCREEN_WIDTH);
      }
    },
  });

  // Set up animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Update translateX when activeTab changes via button press
  useEffect(() => {
    translateX.value = withTiming(activeTab === 'workouts' ? 0 : -SCREEN_WIDTH);
  }, [activeTab, translateX]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                onPress={() => changeTab('workouts')}
              >
                Workouts
              </Text>
              <Text
                style={[
                  styles.tabButton,
                  activeTab === 'exercises' && styles.activeTabButton
                ]}
                onPress={() => changeTab('exercises')}
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

          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.tabContent, animatedStyle]}>
              <View style={styles.tabPage}>
                <ScrollView
                  ref={scrollViewRef}
                  style={styles.contentContainer}
                  showsVerticalScrollIndicator={false}
                >
                  {workouts.length > 0 ? (
                    workouts.map(workout => (
                      <WorkoutCard
                        key={workout.id}
                        workout={workout}
                        onToggleFavorite={handleToggleWorkoutFavorite} onDelete={function(id: string): void {
                        throw new Error('Function not implemented.');
                      }}                      />
                    ))
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyTitle}>No Favorite Workouts</Text>
                      <Text style={styles.emptyText}>
                        Add workouts to your favorites by tapping the heart icon.
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>

              <View style={styles.tabPage}>
                <ScrollView
                  style={styles.contentContainer}
                  showsVerticalScrollIndicator={false}
                >
                  {exercises.length > 0 ? (
                    exercises.map(exercise => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        onToggleFavorite={handleToggleExerciseFavorite} onDelete={function(id: string): void {
                        throw new Error('Function not implemented.');
                      }}                      />
                    ))
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyTitle}>No Favorite Exercises</Text>
                      <Text style={styles.emptyText}>
                        Add exercises to your favorites by tapping the heart icon.
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
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
  },
  tabContent: {
    flex: 1,
    flexDirection: 'row',
    width: SCREEN_WIDTH * 2,
  },
  tabPage: {
    width: SCREEN_WIDTH,
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