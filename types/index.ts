export type ExerciseCategory = 
  | 'bodyweight'
  | 'equipment'
  | 'flexibility'
  | 'cardio'
  | 'strength'
  | 'hiit';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  imageUrl: string;
  videoUrl?: string;
  category: ExerciseCategory;
  equipment: string[];
  duration?: number; // in seconds
  repetitions?: number;
  sets?: number;
  difficultyLevel: DifficultyLevel;
  tips?: string[];
  commonMistakes?: string[];
  isFavorite: boolean;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  difficultyLevel: DifficultyLevel;
  duration: number; // in minutes
  exercises: WorkoutExercise[];
  isFavorite: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  duration?: number; // in seconds
  repetitions?: number;
  sets?: number;
  restAfter: number; // in seconds
}

export interface WorkoutHistory {
  id: string;
  workoutId: string;
  workoutName: string;
  date: string;
  duration: number; // in seconds
  exercisesCompleted: number;
  caloriesBurned?: number;
}

export interface WorkoutSession {
  workoutId: string;
  currentExerciseIndex: number;
  startTime: number;
  elapsedTime: number;
  isPaused: boolean;
  pauseStartTime?: number;
}