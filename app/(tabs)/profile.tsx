import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { getExercises, getWorkoutPlans } from '../../utils/storage';
import { Exercise, WorkoutPlan } from '../../types';
import { Settings, Heart, Award, Calendar, User } from 'lucide-react-native';
import UserNameSetup, { getUserName } from '@/components/UserNameSetup';

export default function ProfileScreen() {
  const router = useRouter();
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
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header with settings button */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/settings')}>
            <Settings size={24} color="#555" />
          </TouchableOpacity>
        </View>

        {/* User profile section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <User size={60} color="#FF5757" style={styles.profileImage} />
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userLevel}>{user.level} • Member since {user.joinDate}</Text>
          <UserNameSetup onSave={handleNameSave} />
        </View>

        {/* Stats section */}
        <View style={styles.statsContainer}>
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
          <Text style={styles.sectionTitle}>Favorite Exercises</Text>
          {favoriteExercises.length > 0 ? (
            favoriteExercises.map(exercise => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.favoriteItem}
                onPress={() => router.push(`/exercise/${exercise.id}`)}
              >
                <Text style={styles.favoriteItemName}>{exercise.name}</Text>
                <Text style={styles.favoriteItemCategory}>{exercise.category}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No favorite exercises yet</Text>
          )}
        </View>

        {/* Favorite workouts section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorite Workouts</Text>
          {favoriteWorkouts.length > 0 ? (
            favoriteWorkouts.map(workout => (
              <TouchableOpacity
                key={workout.id}
                style={styles.favoriteItem}
                onPress={() => router.push(`/workout/${workout.id}`)}
              >
                <Text style={styles.favoriteItemName}>{workout.name}</Text>
                <Text style={styles.favoriteItemCategory}>{workout.exercises.length} exercises</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No favorite workouts yet</Text>
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
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#333',
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
    backgroundColor: '#f1f1f1',
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
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
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
    color: '#333',
    fontFamily: 'Poppins-Bold',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  section: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  favoriteItem: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
  },
  favoriteItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'Poppins-Medium',
  },
  favoriteItemCategory: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
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