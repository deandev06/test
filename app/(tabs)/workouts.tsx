import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { getExercises, getWorkoutPlans, toggleExerciseFavorite, toggleWorkoutPlanFavorite } from '../../utils/storage';
import { Exercise, WorkoutPlan } from '../../types';
import ExerciseCard from '../../components/ExerciseCard';
import WorkoutCard from '../../components/WorkoutCard';
import SearchBar from '../../components/SearchBar';
import CategoryFilter from '../../components/CategoryFilter';
import { Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function WorkoutsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [activeTab, setActiveTab] = useState<'workouts' | 'exercises'>('workouts');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const loadedExercises = await getExercises();
      setExercises(loadedExercises);
      
      const loadedWorkouts = await getWorkoutPlans();
      setWorkouts(loadedWorkouts);
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
  };

  const handleAddNew = () => {
    if (activeTab === 'workouts') {
      router.push('/create-workout');
    } else {
      router.push('/create-exercise');
    }
  };

  const exerciseCategories = [...new Set(exercises.map(ex => ex.category))];
  const workoutCategories = [...new Set(workouts.map(w => w.category))];
  
  const filteredExercises = exercises
    .filter(ex => 
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(ex => selectedCategory ? ex.category === selectedCategory : true);

  const filteredWorkouts = workouts
    .filter(w => 
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(w => selectedCategory ? w.category === selectedCategory : true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Library</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddNew}
          >
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={`Search ${activeTab}...`}
        />
        
        <View style={styles.tabContainer}>
          <View style={styles.tabButtons}>
            <Text
              style={[
                styles.tabButton,
                activeTab === 'workouts' && styles.activeTabButton
              ]}
              onPress={() => {
                setActiveTab('workouts');
                setSelectedCategory(null);
              }}
            >
              Workouts
            </Text>
            <Text
              style={[
                styles.tabButton,
                activeTab === 'exercises' && styles.activeTabButton
              ]}
              onPress={() => {
                setActiveTab('exercises');
                setSelectedCategory(null);
              }}
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
        
        <CategoryFilter 
          categories={activeTab === 'workouts' ? workoutCategories : exerciseCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        
        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
          {activeTab === 'workouts' ? (
            <>
              {filteredWorkouts.map(workout => (
                <WorkoutCard 
                  key={workout.id}
                  workout={workout}
                  onToggleFavorite={handleToggleWorkoutFavorite}
                />
              ))}
              
              {filteredWorkouts.length === 0 && (
                <Text style={styles.emptyText}>No workouts found</Text>
              )}
            </>
          ) : (
            <>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  addButton: {
    backgroundColor: '#FF5757',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginVertical: 24,
    fontFamily: 'Poppins-Regular',
  },
});