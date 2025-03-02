import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialExercises, initialWorkoutPlans } from '../data/initialData';
import { saveExercises, saveWorkoutPlans } from './storage';

export const initializeAppData = async (): Promise<void> => {
  try {
    // Check if data has been initialized before
    const initialized = await AsyncStorage.getItem('dataInitialized');
    
    if (!initialized) {
      // Save initial exercises
      await saveExercises(initialExercises);
      
      // Save initial workout plans
      await saveWorkoutPlans(initialWorkoutPlans);
      
      // Mark data as initialized
      await AsyncStorage.setItem('dataInitialized', 'true');
      
      console.log('App data initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing app data:', error);
  }
};