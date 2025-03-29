import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform, Dimensions, TouchableOpacity } from 'react-native';
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
import Header from '@/components/Header';
import { useTheme } from '@/context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FavoritesScreen() {
  const { theme } = useTheme();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [activeTab, setActiveTab] = useState<'workouts' | 'exercises'>('workouts');

  // For swipe animation
  const translateX = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const loadData = async () => {
    const loadedExercises = await getExercises();
    setExercises(loadedExercises.filter(ex => ex.isFavorite));

    const loadedWorkouts = await getWorkoutPlans();
    setWorkouts(loadedWorkouts.filter(w => w.isFavorite));
  };

  // Use useFocusEffect to refresh data whenever the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadData();
      return () => {};
    }, [])
  );

  // Initial load
  useEffect(() => {
    loadData();
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
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Header title="Favorites" />
          <View style={styles.tabContainer}>
            <View style={styles.tabButtons}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'workouts' && styles.activeTabButton
                ]}
                onPress={() => changeTab('workouts')}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    { color: activeTab === 'workouts' ? '#FF5757' : theme.secondaryText }
                  ]}
                >
                  Workouts
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'exercises' && styles.activeTabButton
                ]}
                onPress={() => changeTab('exercises')}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    { color: activeTab === 'exercises' ? '#FF5757' : theme.secondaryText }
                  ]}
                >
                  Exercises
                </Text>
              </TouchableOpacity>
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
                        onToggleFavorite={handleToggleWorkoutFavorite}
                        onDelete={(id: string) => {
                          // Implement delete function
                        }}
                      />
                    ))
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Text style={[styles.emptyTitle, { color: theme.text }]}>No Favorite Workouts</Text>
                      <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
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
                        onToggleFavorite={handleToggleExerciseFavorite}
                        onDelete={(id: string) => {
                          // Implement delete function
                        }}
                      />
                    ))
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Text style={[styles.emptyTitle, { color: theme.text }]}>No Favorite Exercises</Text>
                      <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
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
  },
  container: {
    flex: 1,
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
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  activeTabButton: {
    // Active state styling handled through text color
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
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 32,
  },
});