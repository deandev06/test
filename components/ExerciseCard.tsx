import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { Heart, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Exercise } from '../types';
import { useTheme } from '@/context/ThemeContext';

interface ExerciseCardProps {
  exercise: Exercise;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ExerciseCard({ exercise, onToggleFavorite, onDelete }: ExerciseCardProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePress = () => {
    router.push(`/exercise/${exercise.id}`);
  };

  const handleFavoritePress = () => {
    onToggleFavorite(exercise.id);
  };

  const handleDeletePress = () => {
    setIsDeleting(true);
    Alert.alert(
      "Delete Exercise",
      `Are you sure you want to delete "${exercise.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setIsDeleting(false)
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDelete(exercise.id);
            setIsDeleting(false);
          }
        }
      ]
    );
  };

  // Determine if we're in dark mode based on the background color brightness
  // This is a simple approach - we assume dark backgrounds have lower brightness values
  const isDarkMode = theme.background.startsWith('#0') || theme.background.startsWith('#1') ||
    theme.background.startsWith('#2') || theme.background.startsWith('#3');

  // Adjust overlay based on background brightness
  const overlayColor = isDarkMode
    ? 'rgba(0, 0, 0, 0.6)'
    : 'rgba(0, 0, 0, 0.4)';

  // Use the theme's text colors
  const textColor = '#fff'; // Keep white for contrast over the image
  const secondaryTextColor = 'rgba(255, 255, 255, 0.8)';

  const tagBackgroundColor = isDarkMode
    ? 'rgba(30, 30, 30, 0.6)'
    : 'rgba(255, 255, 255, 0.2)';

  const iconColor = '#fff'; // Keep white for contrast

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          ...Platform.select({
            web: {
              boxShadow: isDarkMode
                ? '0 4px 6px rgba(0, 0, 0, 0.3)'
                : '0 4px 6px rgba(0, 0, 0, 0.1)',
            },
            default: {
              shadowColor: '#000',
              shadowOpacity: isDarkMode ? 0.3 : 0.1,
            },
          }),
        }
      ]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: exercise.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={[
        styles.overlay,
        { backgroundColor: overlayColor }
      ]}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: textColor }]}>
              {exercise.name}
            </Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDeletePress}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                disabled={isDeleting}
              >
                <Trash2
                  size={22}
                  color={iconColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleFavoritePress}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Heart
                  size={22}
                  color={exercise.isFavorite ? '#FF5757' : iconColor}
                  fill={exercise.isFavorite ? '#FF5757' : 'transparent'}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.tagContainer}>
              <Text style={[styles.tag, { backgroundColor: tagBackgroundColor, color: textColor }]}>
                {exercise.category}
              </Text>
              <Text style={[styles.tag, { backgroundColor: tagBackgroundColor, color: textColor }]}>
                {exercise.difficultyLevel}
              </Text>
              {exercise.equipment && exercise.equipment.length > 0 && (
                <Text style={[styles.tag, { backgroundColor: tagBackgroundColor, color: textColor }]}>
                  {exercise.equipment.join(', ')}
                </Text>
              )}
            </View>

            <Text style={[styles.description, { color: secondaryTextColor }]} numberOfLines={2}>
              {exercise.description}
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
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  detailsContainer: {
    gap: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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