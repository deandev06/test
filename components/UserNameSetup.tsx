import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

interface UserNameSetupProps {
  onSave: (name: string) => void;
}

const USER_NAME_KEY = '@FitnessApp:userName';

const UserNameSetup: React.FC<UserNameSetupProps> = ({ onSave }) => {
  const [name, setName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Check if user name already exists
    checkUserName();
  }, []);

  const checkUserName = async () => {
    try {
      const savedName = await AsyncStorage.getItem(USER_NAME_KEY);
      if (!savedName) {
        // If no name is saved, show the modal
        setModalVisible(true);
      } else {
        // If name exists, pass it to the parent component
        onSave(savedName);
      }
    } catch (error) {
      console.error('Error checking user name:', error);
      setModalVisible(true);
    }
  };

  const handleSaveName = async () => {
    if (!name.trim()) {
      Alert.alert('Please enter your name');
      return;
    }

    try {
      await AsyncStorage.setItem(USER_NAME_KEY, name.trim());
      onSave(name.trim());
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving user name:', error);
      Alert.alert('Error', 'Failed to save your name. Please try again.');
    }
  };

  const editUserName = () => {
    setModalVisible(true);
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          if (!name) {
            Alert.alert('Name Required', 'Please enter your name to continue.');
          } else {
            setModalVisible(false);
          }
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Welcome to Fitness App!</Text>
            <Text style={styles.modalSubtitle}>Please enter your name to get started</Text>

            <TextInput
              style={styles.input}
              placeholder="Your Name"
              value={name}
              onChangeText={setName}
              autoFocus
              autoCapitalize="words"
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveName}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={editUserName} style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Name</Text>
      </TouchableOpacity>
    </View>
  );
};

// Function to get the user name (can be used anywhere in the app)
export const getUserName = async (): Promise<string> => {
  try {
    const name = await AsyncStorage.getItem(USER_NAME_KEY);
    return name || 'User';
  } catch (error) {
    console.error('Error getting user name:', error);
    return 'User';
  }
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#FF5757',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  editButtonText: {
    color: '#FF5757',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
});

export default UserNameSetup;