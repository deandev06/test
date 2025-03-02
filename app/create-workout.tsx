import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Platform,
  Alert,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Minus, Search, X } from 'lucide-react-native';
import { getExercises, addWorkoutPlan } from '../utils/storage';
import { Exercise, WorkoutPlan, DifficultyLevel, WorkoutExercise } from '../types';

export default function CreateWorkoutScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80');
  const [category, setCategory] = useState('Full Body');
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>('beginner');
  const [duration, setDuration] = useState('30');
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);

  const difficultyLevels: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];
  const categories = ['Full Body', 'Upper Body', 'Lower Body', 'Core', 'Cardio', 'HIIT', 'Flexibility'];

  useEffect(() => {
    const loadExercises = async () => {
      const loadedExercises = await getExercises();
      setExercises(loadedExercises);
    };
    
    loadExercises();
  }, []);

  const handleAddExercise = (exercise: Exercise) => {
    const newWorkoutExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      duration: exercise.duration,
      repetitions: exercise.repetitions,
      sets: exercise.sets,
      restAfter: 30
    };
    
    setSelectedExercises([...selectedExercises, newWorkoutExercise]);
    setShowExerciseSelector(false);
    setSearchQuery('');
  };

  const handleRemoveExercise = (index: number) => {
    const newExercises = [...selectedExercises];
    newExercises.splice(index, 1);
    setSelectedExercises(newExercises);
  };

  const handleUpdateExerciseRest = (index: number, value: string) => {
    const newExercises = [...selectedExercises];
    newExercises[index].restAfter = Number(value);
    setSelectedExercises(newExercises);
  };

  const handleUpdateExerciseDuration = (index: number, value: string) => {
    const newExercises = [...selectedExercises];
    newExercises[index].duration = Number(value);
    setSelectedExercises(newExercises);
  };

  const handleUpdateExerciseReps = (index: number, value: string) => {
    const newExercises = [...selectedExercises];
    newExercises[index].repetitions = Number(value);
    setSelectedExercises(newExercises);
  };

  const handleUpdateExerciseSets = (index: number, value: string) => {
    const newExercises = [...selectedExercises];
    newExercises[index].sets = Number(value);
    setSelectedExercises(newExercises);
  };

  const validateForm = () => {
    if (!name.trim()) return 'Workout name is required';
    if (!description.trim()) return 'Description is required';
    if (!imageUrl.trim()) return 'Image URL is required';
    if (!duration.trim() || isNaN(Number(duration)) || Number(duration) <= 0) {
      return 'Duration must be a positive number';
    }
    if (selectedExercises.length === 0) {
      return 'At least one exercise is required';
    }
    return null;
  };

  const handleSave = async () => {
    const error = validateForm();
    if (error) {
      if (Platform.OS === 'web') {
        alert(error);
      } else {
        Alert.alert('Validation Error', error);
      }
      return;
    }

    const newWorkout: WorkoutPlan = {
      id: Date.now().toString(),
      name,
      description,
      imageUrl,
      category,
      difficultyLevel,
      duration: Number(duration),
      exercises: selectedExercises,
      isFavorite: false
    };

    await addWorkoutPlan(newWorkout);
    router.back();
  };

  const getExerciseById = (id: string): Exercise | undefined => {
    return exercises.find(ex => ex.id === id);
  };

  const filteredExercises = exercises.filter(ex => 
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Workout</Text>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {showExerciseSelector ? (
        <View style={styles.exerciseSelectorContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search exercises..."
            />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowExerciseSelector(false)}
            >
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.exerciseList}>
            {filteredExercises.map(exercise => (
              <TouchableOpacity 
                key={exercise.id} 
                style={styles.exerciseItem}
                onPress={() => handleAddExercise(exercise)}
              >
                <Image 
                  source={{ uri: exercise.imageUrl }} 
                  style={styles.exerciseImage} 
                  resizeMode="cover"
                />
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseCategory}>{exercise.category}</Text>
                </View>
                <Plus size={20} color="#FF5757" />
              </TouchableOpacity>
            ))}
            
            {filteredExercises.length === 0 && (
              <Text style={styles.noExercisesText}>No exercises found</Text>
            )}
          </ScrollView>
        </View>
      ) : (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Workout name"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the workout"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="https://example.com/image.jpg"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.optionsContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.optionButton,
                    category === cat && styles.selectedOption
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      category === cat && styles.selectedOptionText
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Difficulty Level</Text>
            <View style={styles.optionsContainer}>
              {difficultyLevels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.optionButton,
                    difficultyLevel === level && styles.selectedOption
                  ]}
                  onPress={() => setDifficultyLevel(level)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      difficultyLevel === level && styles.selectedOptionText
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Duration (minutes)</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              placeholder="30"
            />
          </View>

          <View style={[styles.formGroup, styles.lastFormGroup]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.label}>Exercises</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowExerciseSelector(true)}
              >
                <Plus size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add Exercise</Text>
              </TouchableOpacity>
            </View>
            
            {selectedExercises.length === 0 ? (
              <TouchableOpacity 
                style={styles.emptyExercisesContainer}
                onPress={() => setShowExerciseSelector(true)}
              >
                <Plus size={32} color="#ccc" />
                <Text style={styles.emptyExercisesText}>Add exercises to your workout</Text>
              </TouchableOpacity>
            ) : (
              selectedExercises.map((workoutExercise, index) => {
                const exercise = getExerciseById(workoutExercise.exerciseId);
                if (!exercise) return null;
                
                return (
                  <View key={index} style={styles.workoutExerciseItem}>
                    <View style={styles.workoutExerciseHeader}>
                      <Image 
                        source={{ uri: exercise.imageUrl }} 
                        style={styles.workoutExerciseImage} 
                        resizeMode="cover"
                      />
                      <View style={styles.workoutExerciseInfo}>
                        <Text style={styles.workoutExerciseName}>{exercise.name}</Text>
                        <Text style={styles.workoutExerciseCategory}>{exercise.category}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.removeExerciseButton}
                        onPress={() => handleRemoveExercise(index)}
                      >
                        <X size={20} color="#FF5757" />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.workoutExerciseSettings}>
                      {workoutExercise.duration !== undefined ? (
                        <View style={styles.settingItem}>
                          <Text style={styles.settingLabel}>Duration (sec)</Text>
                          <TextInput
                            style={styles.settingInput}
                            value={workoutExercise.duration.toString()}
                            onChangeText={(value) => handleUpdateExerciseDuration(index, value)}
                            keyboardType="numeric"
                          />
                        </View>
                      ) : (
                        <>
                          <View style={styles.settingItem}>
                            <Text style={styles.settingLabel}>Reps</Text>
                            <TextInput
                              style={styles.settingInput}
                              value={workoutExercise.repetitions?.toString() || ''}
                              onChangeText={(value) => handleUpdateExerciseReps(index, value)}
                              keyboardType="numeric"
                            />
                          </View>
                          <View style={styles.settingItem}>
                            <Text style={styles.settingLabel}>Sets</Text>
                            <TextInput
                              style={styles.settingInput}
                              value={workoutExercise.sets?.toString() || ''}
                              onChangeText={(value) => handleUpdateExerciseSets(index, value)}
                              keyboardType="numeric"
                            />
                          </View>
                        </>
                      )}
                      <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Rest (sec)</Text>
                        <TextInput
                          style={styles.settingInput}
                          value={workoutExercise.restAfter.toString()}
                          onChangeText={(value) => handleUpdateExerciseRest(index, value)}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 24 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FF5757',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  lastFormGroup: {
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#FF5757',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Medium',
    textTransform: 'capitalize',
  },
  selectedOptionText: {
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#FF5757',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  emptyExercisesContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyExercisesText: {
    fontSize: 16,
    color: '#999',
    fontFamily: 'Poppins-Regular',
  },
  exerciseSelectorContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  closeButton: {
    marginLeft: 12,
  },
  exerciseList: {
    flex: 1,
    padding: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  exerciseImage: {
    width: 60,
    height: 60,
  },
  exerciseInfo: {
    flex: 1,
    padding: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  exerciseCategory: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    textTransform: 'capitalize',
  },
  noExercisesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 24,
    fontFamily: 'Poppins-Regular',
  },
  workoutExerciseItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  workoutExerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutExerciseImage: {
    width: 60,
    height: 60,
  },
  workoutExerciseInfo: {
    flex: 1,
    padding: 12,
  },
  workoutExerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  workoutExerciseCategory: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    textTransform: 'capitalize',
  },
  removeExerciseButton: {
    padding: 12,
  },
  workoutExerciseSettings: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    paddingTop: 0,
    gap: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  settingLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
    fontFamily: 'Poppins-Medium',
  },
  settingInput: {
    width: 40,
    fontSize: 12,
    color: '#333',
    padding: 0,
    fontFamily: 'Poppins-Regular',
  },
});