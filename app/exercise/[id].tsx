import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Heart, ArrowLeft, Clock, Dumbbell, BarChart3 } from 'lucide-react-native';
import { getExerciseById, toggleExerciseFavorite } from '../../utils/storage';
import { Exercise } from '../../types';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExercise = async () => {
      if (id) {
        const exerciseData = await getExerciseById(id);
        setExercise(exerciseData);
      }
      setLoading(false);
    };
    
    loadExercise();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (exercise) {
      await toggleExerciseFavorite(exercise.id);
      const updatedExercise = await getExerciseById(exercise.id);
      setExercise(updatedExercise);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!exercise) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Exercise not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: exercise.imageUrl }} 
            style={styles.image} 
            resizeMode="cover"
          />
          <View style={styles.overlay}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.favoriteButton} 
              onPress={handleToggleFavorite}
            >
              <Heart 
                size={24} 
                color="#fff" 
                fill={exercise.isFavorite ? '#fff' : 'transparent'} 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{exercise.name}</Text>
          
          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <BarChart3 size={16} color="#666" />
              <Text style={styles.tagText}>{exercise.difficultyLevel}</Text>
            </View>
            
            <View style={styles.tag}>
              <Dumbbell size={16} color="#666" />
              <Text style={styles.tagText}>{exercise.category}</Text>
            </View>
            
            {(exercise.duration || exercise.repetitions) && (
              <View style={styles.tag}>
                <Clock size={16} color="#666" />
                <Text style={styles.tagText}>
                  {exercise.duration 
                    ? `${exercise.duration} sec` 
                    : `${exercise.repetitions} reps`}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{exercise.description}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {exercise.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>{index + 1}</Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
          
          {exercise.tips && exercise.tips.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tips</Text>
              {exercise.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipText}>• {tip}</Text>
                </View>
              ))}
            </View>
          )}
          
          {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Common Mistakes</Text>
              {exercise.commonMistakes.map((mistake, index) => (
                <View key={index} style={styles.mistakeItem}>
                  <Text style={styles.mistakeText}>• {mistake}</Text>
                </View>
              ))}
            </View>
          )}
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'web' ? 24 : 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FF5757',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Medium',
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF5757',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
  mistakeItem: {
    marginBottom: 8,
  },
  mistakeText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
});