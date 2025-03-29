import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { getExercises, getWorkoutPlans } from '@/utils/storage';
import { Exercise, WorkoutPlan } from '@/types';
import { Settings, Heart, Award, Calendar, User } from 'lucide-react-native';
import UserNameSetup, { getUserName } from '@/components/UserNameSetup';
import { useTheme } from '@/context/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [favoriteExercises, setFavoriteExercises] = useState<Exercise[]>([]);
  const [favoriteWorkouts, setFavoriteWorkouts] = useState<WorkoutPlan[]>([]);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [userName, setUserName] = useState('');

  // Mock user data - in a real app, this would come from user authentication or local storage
  const user = {
    email: 'user@example.com',
    joinDate: 'January 2023',
    level: 'Intermediate',
    streak: 8,
    totalWorkoutsCompleted: 42
  };

  useEffect(() => {
    const loadUserData = async () => {
      // Get user name
      const name = await getUserName();
      setUserName(name);

      // Get favorite exercises
      const exercises = await getExercises();
      const favExercises = exercises.filter(ex => ex.isFavorite);
      setFavoriteExercises(favExercises);

      // Get favorite workouts
      const workouts = await getWorkoutPlans();
      const favWorkouts = workouts.filter(w => w.isFavorite);
      setFavoriteWorkouts(favWorkouts);

      // Total workouts count
      setTotalWorkouts(workouts.length);
    };

    // Initial load
    loadUserData();

    // Set up an interval to refresh data every 2 seconds
    const intervalId = setInterval(loadUserData, 2000);

    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleNameSave = (name: string) => {
    setUserName(name);
  };

  const renderStat = (icon: React.ReactNode, title: string, value: string | number) => (
    <View style={styles.statItem}>
      {icon}
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: theme.secondaryText }]}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with settings button */}
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/settings')}>
            <Settings size={24} color={theme.secondaryText} />
          </TouchableOpacity>
        </View>

        {/* User profile section */}
        <View style={styles.profileSection}>
          <View style={[styles.profileImageContainer, { backgroundColor: '#f1f1f1' }]}>
            <User size={60} color="#FF5757" style={styles.profileImage} />
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>{userName}</Text>
          <Text style={[styles.userEmail, { color: theme.secondaryText }]}>{user.email}</Text>
          <Text style={[styles.userLevel, { color: theme.secondaryText }]}>
            {user.level} • Member since {user.joinDate}
          </Text>
          <UserNameSetup onSave={handleNameSave} />
        </View>

        {/* Stats section */}
        <View style={[styles.statsContainer, { borderColor: '#eee' }]}>
          {renderStat(
            <Award size={28} color="#FF5757" style={styles.statIcon} />,
            'Streak',
            user.streak
          )}
          {renderStat(
            <Calendar size={28} color="#FF5757" style={styles.statIcon} />,
            'Workouts',
            user.totalWorkoutsCompleted
          )}
          {renderStat(
            <Heart size={28} color="#FF5757" style={styles.statIcon} />,
            'Favorites',
            favoriteExercises.length + favoriteWorkouts.length
          )}
        </View>

        {/* Favorite exercises section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Favorite Exercises</Text>
          {favoriteExercises.length > 0 ? (
            favoriteExercises.map(exercise => (
              <TouchableOpacity
                key={exercise.id}
                style={[styles.favoriteItem, { backgroundColor: theme.inputBackground }]}
                onPress={() => router.push(`/exercise/${exercise.id}`)}
              >
                <Text style={[styles.favoriteItemName, { color: theme.text }]}>{exercise.name}</Text>
                <Text style={[styles.favoriteItemCategory, { color: theme.secondaryText }]}>
                  {exercise.category}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: theme.secondaryText }]}>No favorite exercises yet</Text>
          )}
        </View>

        {/* Favorite workouts section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Favorite Workouts</Text>
          {favoriteWorkouts.length > 0 ? (
            favoriteWorkouts.map(workout => (
              <TouchableOpacity
                key={workout.id}
                style={[styles.favoriteItem, { backgroundColor: theme.inputBackground }]}
                onPress={() => router.push(`/workout/${workout.id}`)}
              >
                <Text style={[styles.favoriteItemName, { color: theme.text }]}>{workout.name}</Text>
                <Text style={[styles.favoriteItemCategory, { color: theme.secondaryText }]}>
                  {workout.exercises.length} exercises
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: theme.secondaryText }]}>No favorite workouts yet</Text>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/create-exercise')}
          >
            <Text style={styles.actionButtonText}>Create Exercise</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/create-workout')}
          >
            <Text style={styles.actionButtonText}>Create Workout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  settingsButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: 'center',
    padding: 16,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    borderRadius: 50,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  section: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  favoriteItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  favoriteItemName: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  favoriteItemCategory: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 24,
    fontFamily: 'Poppins-Regular',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 32,
  },
  actionButton: {
    backgroundColor: '#FF5757',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});