import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Minus } from 'lucide-react-native';
import { addExercise } from '@/utils/storage';
import { Exercise, DifficultyLevel, ExerciseCategory } from '@/types';
import { useTheme } from '@/context/ThemeContext';

export default function CreateExerciseScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80');
  const [category, setCategory] = useState<ExerciseCategory>('bodyweight');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [newEquipment, setNewEquipment] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>('beginner');
  const [exerciseType, setExerciseType] = useState<'duration' | 'repetition'>('duration');
  const [duration, setDuration] = useState('30');
  const [repetitions, setRepetitions] = useState('10');
  const [sets, setSets] = useState('3');
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [tips, setTips] = useState<string[]>(['']);
  const [commonMistakes, setCommonMistakes] = useState<string[]>(['']);

  const categories: ExerciseCategory[] = ['bodyweight', 'equipment', 'flexibility', 'cardio', 'strength', 'hiit'];
  const difficultyLevels: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];

  const handleAddEquipment = () => {
    if (newEquipment.trim()) {
      setEquipment([...equipment, newEquipment.trim()]);
      setNewEquipment('');
    }
  };

  const handleRemoveEquipment = (index: number) => {
    const newEquipment = [...equipment];
    newEquipment.splice(index, 1);
    setEquipment(newEquipment);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleUpdateInstruction = (text: string, index: number) => {
    const newInstructions = [...instructions];
    newInstructions[index] = text;
    setInstructions(newInstructions);
  };

  const handleRemoveInstruction = (index: number) => {
    if (instructions.length > 1) {
      const newInstructions = [...instructions];
      newInstructions.splice(index, 1);
      setInstructions(newInstructions);
    }
  };

  const handleAddTip = () => {
    setTips([...tips, '']);
  };

  const handleUpdateTip = (text: string, index: number) => {
    const newTips = [...tips];
    newTips[index] = text;
    setTips(newTips);
  };

  const handleRemoveTip = (index: number) => {
    if (tips.length > 1 || tips[0] === '') {
      const newTips = [...tips];
      newTips.splice(index, 1);
      setTips(newTips);
    }
  };

  const handleAddMistake = () => {
    setCommonMistakes([...commonMistakes, '']);
  };

  const handleUpdateMistake = (text: string, index: number) => {
    const newMistakes = [...commonMistakes];
    newMistakes[index] = text;
    setCommonMistakes(newMistakes);
  };

  const handleRemoveMistake = (index: number) => {
    if (commonMistakes.length > 1 || commonMistakes[0] === '') {
      const newMistakes = [...commonMistakes];
      newMistakes.splice(index, 1);
      setCommonMistakes(newMistakes);
    }
  };

  const validateForm = () => {
    if (!name.trim()) return 'Exercise name is required';
    if (!description.trim()) return 'Description is required';
    if (!imageUrl.trim()) return 'Image URL is required';
    if (exerciseType === 'duration') {
      if (!duration.trim() || isNaN(Number(duration)) || Number(duration) <= 0) {
        return 'Duration must be a positive number';
      }
    } else {
      if (!repetitions.trim() || isNaN(Number(repetitions)) || Number(repetitions) <= 0) {
        return 'Repetitions must be a positive number';
      }
      if (!sets.trim() || isNaN(Number(sets)) || Number(sets) <= 0) {
        return 'Sets must be a positive number';
      }
    }
    if (!instructions[0].trim()) return 'At least one instruction is required';
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

    // Filter out empty strings
    const filteredInstructions = instructions.filter(i => i.trim());
    const filteredTips = tips.filter(t => t.trim());
    const filteredMistakes = commonMistakes.filter(m => m.trim());

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name,
      description,
      instructions: filteredInstructions,
      imageUrl,
      category,
      equipment,
      difficultyLevel,
      tips: filteredTips.length > 0 ? filteredTips : undefined,
      commonMistakes: filteredMistakes.length > 0 ? filteredMistakes : undefined,
      isFavorite: false
    };

    if (exerciseType === 'duration') {
      newExercise.duration = Number(duration);
    } else {
      newExercise.repetitions = Number(repetitions);
      newExercise.sets = Number(sets);
    }

    await addExercise(newExercise);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Exercise</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Exercise name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the exercise"
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
          <Text style={styles.label}>Equipment</Text>
          <View style={styles.equipmentInputContainer}>
            <TextInput
              style={[styles.input, styles.equipmentInput]}
              value={newEquipment}
              onChangeText={setNewEquipment}
              placeholder="Add equipment (optional)"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddEquipment}
            >
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {equipment.length > 0 && (
            <View style={styles.equipmentList}>
              {equipment.map((item, index) => (
                <View key={index} style={styles.equipmentItem}>
                  <Text style={styles.equipmentText}>{item}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveEquipment(index)}
                  >
                    <Minus size={16} color="#FF5757" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
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
          <Text style={styles.label}>Exercise Type</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                exerciseType === 'duration' && styles.selectedOption
              ]}
              onPress={() => setExerciseType('duration')}
            >
              <Text
                style={[
                  styles.optionText,
                  exerciseType === 'duration' && styles.selectedOptionText
                ]}
              >
                Time-based
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                exerciseType === 'repetition' && styles.selectedOption
              ]}
              onPress={() => setExerciseType('repetition')}
            >
              <Text
                style={[
                  styles.optionText,
                  exerciseType === 'repetition' && styles.selectedOptionText
                ]}
              >
                Repetition-based
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {exerciseType === 'duration' ? (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Duration (seconds)</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              placeholder="30"
            />
          </View>
        ) : (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Repetitions</Text>
              <TextInput
                style={styles.input}
                value={repetitions}
                onChangeText={setRepetitions}
                keyboardType="numeric"
                placeholder="10"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Sets</Text>
              <TextInput
                style={styles.input}
                value={sets}
                onChangeText={setSets}
                keyboardType="numeric"
                placeholder="3"
              />
            </View>
          </>
        )}

        <View style={styles.formGroup}>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Instructions</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddInstruction}
            >
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {instructions.map((instruction, index) => (
            <View key={index} style={styles.listItemContainer}>
              <TextInput
                style={[styles.input, styles.listItemInput]}
                value={instruction}
                onChangeText={(text) => handleUpdateInstruction(text, index)}
                placeholder={`Step ${index + 1}`}
                multiline
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveInstruction(index)}
                disabled={instructions.length === 1 && !instruction}
              >
                <Minus size={16} color={instructions.length === 1 && !instruction ? '#ccc' : '#FF5757'} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.formGroup}>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Tips (Optional)</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddTip}
            >
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {tips.map((tip, index) => (
            <View key={index} style={styles.listItemContainer}>
              <TextInput
                style={[styles.input, styles.listItemInput]}
                value={tip}
                onChangeText={(text) => handleUpdateTip(text, index)}
                placeholder="Add a helpful tip"
                multiline
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveTip(index)}
              >
                <Minus size={16} color="#FF5757" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={[styles.formGroup, styles.lastFormGroup]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Common Mistakes (Optional)</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddMistake}
            >
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {commonMistakes.map((mistake, index) => (
            <View key={index} style={styles.listItemContainer}>
              <TextInput
                style={[styles.input, styles.listItemInput]}
                value={mistake}
                onChangeText={(text) => handleUpdateMistake(text, index)}
                placeholder="Add a common mistake to avoid"
                multiline
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveMistake(index)}
              >
                <Minus size={16} color="#FF5757" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
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
  equipmentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  equipmentInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#FF5757',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  equipmentList: {
    marginTop: 12,
    gap: 8,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  equipmentText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  listItemInput: {
    flex: 1,
  }
});