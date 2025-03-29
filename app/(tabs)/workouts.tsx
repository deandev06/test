import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Modal,
  Alert,
  StatusBar
} from 'react-native';
import { getExercises, getWorkoutPlans, toggleExerciseFavorite, toggleWorkoutPlanFavorite, deleteExercise, deleteWorkoutPlan } from '@/utils/storage';
import { Exercise, WorkoutPlan } from '@/types';
import ExerciseCard from '../../components/ExerciseCard';
import WorkoutCard from '../../components/WorkoutCard';
import SearchBar from '../../components/SearchBar';
import { Plus, Filter } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';

export default function WorkoutsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Library</Text>
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
            style={[styles.filterButton, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}
            onPress={() => setFilterModalVisible(true)}
          >
            <Filter size={20} color={selectedCategory ? "#FF5757" : theme.secondaryText} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <View style={styles.tabButtons}>
            <Text
              style={[
                styles.tabButton,
                { color: theme.secondaryText },
                activeTab === 'workouts' && [styles.activeTabButton, { color: "#FF5757" }]
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
                { color: theme.secondaryText },
                activeTab === 'exercises' && [styles.activeTabButton, { color: "#FF5757" }]
              ]}
              onPress={() => {
                setActiveTab('exercises');
                setSelectedCategory(null);
              }}
            >
              Exercises
            </Text>
          </View>
          <View style={[styles.tabIndicatorContainer, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.tabIndicator,
                { left: activeTab === 'workouts' ? '0%' : '50%' }
              ]}
            />
          </View>
        </View>

        {selectedCategory && (
          <View style={[styles.activeFilterContainer, { backgroundColor: theme.primary === '#FF5757' ? '#ff575733' : '#fff0f0' }]}>
            <Text style={[styles.activeFilterText, { color: theme.text }]}>
              Filtered by: {selectedCategory}
            </Text>
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={styles.clearFilterText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <Text style={[styles.emptyText, { color: theme.secondaryText }]}>Loading...</Text>
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
                <Text style={[styles.emptyText, { color: theme.secondaryText }]}>No workouts found</Text>
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
                <Text style={[styles.emptyText, { color: theme.secondaryText }]}>No exercises found</Text>
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
          <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Filter by Category</Text>

              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  { borderBottomColor: theme.border },
                  selectedCategory === null && [
                    styles.selectedCategoryItem,
                    { backgroundColor: theme.primary === '#FF5757' ? '#ff575733' : '#fff0f0' }
                  ]
                ]}
                onPress={() => handleSelectCategory(null)}
              >
                <Text style={[
                  styles.categoryText,
                  { color: theme.text },
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
                    { borderBottomColor: theme.border },
                    selectedCategory === category && [
                      styles.selectedCategoryItem,
                      { backgroundColor: theme.primary === '#FF5757' ? '#ff575733' : '#fff0f0' }
                    ]
                  ]}
                  onPress={() => handleSelectCategory(category)}
                >
                  <Text style={[
                    styles.categoryText,
                    { color: theme.text },
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ?
      (StatusBar.currentHeight || 0) + 30 :
      (StatusBar.currentHeight || 0) + 20,
    paddingBottom: 8,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
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
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
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
    fontFamily: 'Poppins-SemiBold',
  },
  activeTabButton: {
    // color is now applied dynamically
  },
  tabIndicatorContainer: {
    height: 3,
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
    fontFamily: 'Poppins-SemiBold',
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  selectedCategoryItem: {
    // backgroundColor now set dynamically based on theme
  },
  categoryText: {
    fontSize: 16,
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
    marginBottom: 8,
  },
  activeFilterText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  clearFilterText: {
    fontSize: 14,
    color: '#FF5757',
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
});