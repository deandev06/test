import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Play, Pause, SkipForward, StopCircle } from 'lucide-react-native';

interface WorkoutControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSkip: () => void;
  onStop: () => void;
}

export default function WorkoutControls({ 
  isPlaying, 
  onPlay, 
  onPause, 
  onSkip, 
  onStop 
}: WorkoutControlsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.stopButton} 
        onPress={onStop}
      >
        <StopCircle size={32} color="#FF5757" />
        <Text style={styles.buttonText}>End</Text>
      </TouchableOpacity>
      
      <View style={styles.centerControls}>
        {isPlaying ? (
          <TouchableOpacity 
            style={styles.mainButton} 
            onPress={onPause}
          >
            <Pause size={32} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.mainButton} 
            onPress={onPlay}
          >
            <Play size={32} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.skipButton} 
        onPress={onSkip}
      >
        <SkipForward size={32} color="#FF5757" />
        <Text style={styles.buttonText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: '100%',
  },
  centerControls: {
    alignItems: 'center',
  },
  mainButton: {
    backgroundColor: '#FF5757',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButton: {
    alignItems: 'center',
  },
  skipButton: {
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins-Medium',
  },
});