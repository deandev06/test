import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Heart, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { WorkoutPlan } from '../types';

interface WorkoutCardProps {
  workout: WorkoutPlan;
  onToggleFavorite: (id: string) => void;
}

export default function WorkoutCard({ workout, onToggleFavorite }: WorkoutCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/workout/${workout.id}`);
  };

  const handleFavoritePress = () => {
    onToggleFavorite(workout.id);
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: workout.imageUrl }} 
        style={styles.image} 
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{workout.name}</Text>
            <TouchableOpacity 
              style={styles.favoriteButton} 
              onPress={handleFavoritePress}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Heart 
                size={22} 
                color={workout.isFavorite ? '#FF5757' : '#fff'} 
                fill={workout.isFavorite ? '#FF5757' : 'transparent'} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.tagContainer}>
              <View style={styles.durationTag}>
                <Clock size={14} color="#fff" />
                <Text style={styles.durationText}>{workout.duration} min</Text>
              </View>
              <Text style={styles.tag}>{workout.category}</Text>
              <Text style={styles.tag}>{workout.difficultyLevel}</Text>
            </View>
            
            <Text style={styles.description} numberOfLines={2}>
              {workout.description}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  detailsContainer: {
    gap: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationTag: {
    backgroundColor: 'rgba(255, 87, 87, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Poppins-Regular',
  },
});