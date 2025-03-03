import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform, TouchableOpacity, Modal, Alert } from 'react-native';
import { getExercises, getWorkoutPlans, toggleExerciseFavorite, toggleWorkoutPlanFavorite, deleteExercise, deleteWorkoutPlan } from '../../utils/storage';
import { Exercise, WorkoutPlan } from '../../types';
import ExerciseCard from '../../components/ExerciseCard';
import WorkoutCard from '../../components/WorkoutCard';
import SearchBar from '../../components/SearchBar';
import { Plus, Filter } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function WorkoutsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [activeTab, setActiveTab] = useState<'workouts' | 'exercises'>('workouts');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const loadedExercises = await getExercises();
      setExercises(loadedExercises);

      const loadedWorkouts = await getWorkoutPlans();
      setWorkouts(loadedWorkouts);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
    // Reload data after toggling
    const updatedExercises = await getExercises();
    setExercises(updatedExercises);
  };

  const handleToggleWorkoutFavorite = async (id: string) => {
    await toggleWorkoutPlanFavorite(id);
    // Reload data after toggling
    const updatedWorkouts = await getWorkoutPlans();
    setWorkouts(updatedWorkouts);
  };

  const handleDeleteExercise = async (id: string) => {
    setIsLoading(true);
    try {
      const success = await deleteExercise(id);
      if (success) {
        // Update the local state directly instead of reloading all data
        setExercises(prevExercises => prevExercises.filter(ex => ex.id !== id));
      } else {
        Alert.alert('Error', 'Failed to delete exercise. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
      Alert.alert('Error', 'Failed to delete exercise. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    setIsLoading(true);
    try {
      const success = await deleteWorkoutPlan(id);
      if (success) {
        // Update the local state directly instead of reloading all data
        setWorkouts(prevWorkouts => prevWorkouts.filter(w => w.id !== id));
      } else {
        Alert.alert('Error', 'Failed to delete workout. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
      Alert.alert('Error', 'Failed to delete workout. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
  const currentCategories = activeTab === 'workouts' ? workoutCategories : exerciseCategories;

  const handleSelectCategory = (category: string | null) => {
    setSelectedCategory(category);
    setFilterModalVisible(false);
  };

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

        <View style={styles.searchFilterContainer}>
          <View style={styles.searchBarContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={`Search ${activeTab}...`}
            />
          </View>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Filter size={20} color={selectedCategory ? "#FF5757" : "#666"} />
          </TouchableOpacity>
        </View>

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

        {selectedCategory && (
          <View style={styles.activeFilterContainer}>
            <Text style={styles.activeFilterText}>
              Filtered by: {selectedCategory}
            </Text>
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={styles.clearFilterText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <Text style={styles.emptyText}>Loading...</Text>
          ) : activeTab === 'workouts' ? (
            <>
              {filteredWorkouts.map(workout => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onToggleFavorite={handleToggleWorkoutFavorite}
                  onDelete={handleDeleteWorkout}
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
                  onDelete={handleDeleteExercise}
                />
              ))}

              {filteredExercises.length === 0 && (
                <Text style={styles.emptyText}>No exercises found</Text>
              )}
            </>
          )}
        </ScrollView>
      </View>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <Text style={styles.modalTitle}>Filter by Category</Text>

              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  selectedCategory === null && styles.selectedCategoryItem
                ]}
                onPress={() => handleSelectCategory(null)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === null && styles.selectedCategoryText
                ]}>
                  All
                </Text>
              </TouchableOpacity>

              {currentCategories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryItem,
                    selectedCategory === category && styles.selectedCategoryItem
                  ]}
                  onPress={() => handleSelectCategory(category)}
                >
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category && styles.selectedCategoryText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// Styles remain the same as in your original file
const styles = StyleSheet.create({
  // All your existing styles should be copied here...
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
  searchFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  searchBarContainer: {
    flex: 1,
    marginRight: 8,
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedCategoryItem: {
    backgroundColor: '#fff0f0',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  selectedCategoryText: {
    color: '#FF5757',
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  activeFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff0f0',
    marginBottom: 8,
  },
  activeFilterText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  clearFilterText: {
    fontSize: 14,
    color: '#FF5757',
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
});