import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise, WorkoutPlan, WorkoutHistory } from '../types';

// Keys for AsyncStorage
const EXERCISES_KEY = 'exercises';
const WORKOUT_PLANS_KEY = 'workoutPlans';
const WORKOUT_HISTORY_KEY = 'workoutHistory';
const CURRENT_SESSION_KEY = 'currentSession';

// Exercise Storage
export const getExercises = async (): Promise<Exercise[]> => {
  try {
    const exercisesJson = await AsyncStorage.getItem(EXERCISES_KEY);
    return exercisesJson ? JSON.parse(exercisesJson) : [];
  } catch (error) {
    console.error('Error getting exercises:', error);
    return [];
  }
};

export const saveExercises = async (exercises: Exercise[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
  } catch (error) {
    console.error('Error saving exercises:', error);
  }
};

export const getExerciseById = async (id: string): Promise<Exercise | null> => {
  try {
    const exercises = await getExercises();
    return exercises.find(exercise => exercise.id === id) || null;
  } catch (error) {
    console.error('Error getting exercise by ID:', error);
    return null;
  }
};

export const toggleExerciseFavorite = async (id: string): Promise<void> => {
  try {
    const exercises = await getExercises();
    const updatedExercises = exercises.map(exercise => 
      exercise.id === id ? { ...exercise, isFavorite: !exercise.isFavorite } : exercise
    );
    await saveExercises(updatedExercises);
  } catch (error) {
    console.error('Error toggling exercise favorite:', error);
  }
};

export const addExercise = async (exercise: Exercise): Promise<void> => {
  try {
    const exercises = await getExercises();
    await saveExercises([...exercises, exercise]);
  } catch (error) {
    console.error('Error adding exercise:', error);
  }
};

// Workout Plans Storage
export const getWorkoutPlans = async (): Promise<WorkoutPlan[]> => {
  try {
    const plansJson = await AsyncStorage.getItem(WORKOUT_PLANS_KEY);
    return plansJson ? JSON.parse(plansJson) : [];
  } catch (error) {
    console.error('Error getting workout plans:', error);
    return [];
  }
};

export const saveWorkoutPlans = async (plans: WorkoutPlan[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(WORKOUT_PLANS_KEY, JSON.stringify(plans));
  } catch (error) {
    console.error('Error saving workout plans:', error);
  }
};

export const getWorkoutPlanById = async (id: string): Promise<WorkoutPlan | null> => {
  try {
    const plans = await getWorkoutPlans();
    return plans.find(plan => plan.id === id) || null;
  } catch (error) {
    console.error('Error getting workout plan by ID:', error);
    return null;
  }
};

export const toggleWorkoutPlanFavorite = async (id: string): Promise<void> => {
  try {
    const plans = await getWorkoutPlans();
    const updatedPlans = plans.map(plan => 
      plan.id === id ? { ...plan, isFavorite: !plan.isFavorite } : plan
    );
    await saveWorkoutPlans(updatedPlans);
  } catch (error) {
    console.error('Error toggling workout plan favorite:', error);
  }
};

export const addWorkoutPlan = async (workout: WorkoutPlan): Promise<void> => {
  try {
    const workouts = await getWorkoutPlans();
    await saveWorkoutPlans([...workouts, workout]);
  } catch (error) {
    console.error('Error adding workout plan:', error);
  }
};

// Workout History Storage
export const getWorkoutHistory = async (): Promise<WorkoutHistory[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(WORKOUT_HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Error getting workout history:', error);
    return [];
  }
};

export const saveWorkoutHistory = async (history: WorkoutHistory[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving workout history:', error);
  }
};

export const addWorkoutToHistory = async (workout: WorkoutHistory): Promise<void> => {
  try {
    const history = await getWorkoutHistory();
    await saveWorkoutHistory([workout, ...history]);
  } catch (error) {
    console.error('Error adding workout to history:', error);
  }
};

// Current Session Storage
export const saveCurrentSession = async (session: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving current session:', error);
  }
};

export const getCurrentSession = async (): Promise<any | null> => {
  try {
    const sessionJson = await AsyncStorage.getItem(CURRENT_SESSION_KEY);
    return sessionJson ? JSON.parse(sessionJson) : null;
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
};

export const clearCurrentSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CURRENT_SESSION_KEY);
  } catch (error) {
    console.error('Error clearing current session:', error);
  }
};

// Add these functions to your storage.ts file

/**
 * Delete an exercise from storage
 * @param id The ID of the exercise to delete
 * @returns boolean indicating success
 */
export async function deleteExercise(id: string): Promise<boolean> {
  try {
    // Get current exercises
    const exercises = await getExercises();

    // Filter out the exercise to delete
    const updatedExercises = exercises.filter(exercise => exercise.id !== id);

    // Save the updated list
    await AsyncStorage.setItem('exercises', JSON.stringify(updatedExercises));

    // Also update any workout plans that might include this exercise
    const workouts = await getWorkoutPlans();
    const updatedWorkouts = workouts.map(workout => {
      // Remove the exercise from the workout's exercises list
      const updatedWorkoutExercises = workout.exercises?.filter(
        exercise => exercise.exerciseId !== id
      ) || [];

      return {
        ...workout,
        exercises: updatedWorkoutExercises
      };
    });

    // Save the updated workouts
    await AsyncStorage.setItem('workoutPlans', JSON.stringify(updatedWorkouts));

    return true;
  } catch (error) {
    console.error('Error deleting exercise:', error);
    return false;
  }
}

/**
 * Delete a workout plan from storage
 * @param id The ID of the workout plan to delete
 * @returns boolean indicating success
 */
export async function deleteWorkoutPlan(id: string): Promise<boolean> {
  try {
    // Get current workout plans
    const workouts = await getWorkoutPlans();

    // Filter out the workout plan to delete
    const updatedWorkouts = workouts.filter(workout => workout.id !== id);

    // Save the updated list
    await AsyncStorage.setItem('workoutPlans', JSON.stringify(updatedWorkouts));

    return true;
  } catch (error) {
    console.error('Error deleting workout plan:', error);
    return false;
  }
}