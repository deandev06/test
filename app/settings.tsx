import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Switch, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Bell, Moon, Clock, Users, HelpCircle, LogOut } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    value?: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <Text style={styles.settingTitle}>{title}</Text>
      <View style={styles.settingValue}>{value}</View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>

          {renderSettingItem(
            <Bell size={24} color="#FF5757" />,
            "Notifications",
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#ccc", true: "#FFA8A8" }}
              thumbColor={notifications ? "#FF5757" : "#f4f3f4"}
            />
          )}

          {renderSettingItem(
            <Moon size={24} color="#FF5757" />,
            "Dark Mode",
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#ccc", true: "#FFA8A8" }}
              thumbColor={darkMode ? "#FF5757" : "#f4f3f4"}
            />
          )}

          {renderSettingItem(
            <Clock size={24} color="#FF5757" />,
            "Workout Reminders",
            <Text style={styles.settingSubtitle}>Daily at 6:00 PM</Text>,
            () => console.log("Workout reminders pressed")
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          {renderSettingItem(
            <Users size={24} color="#FF5757" />,
            "Edit Profile",
            null,
            () => console.log("Edit profile pressed")
          )}

          {renderSettingItem(
            <HelpCircle size={24} color="#FF5757" />,
            "Help & Support",
            null,
            () => console.log("Help & Support pressed")
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color="#FF5757" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 24 : 12,
    paddingBottom: 12,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  section: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  settingValue: {
    alignItems: 'flex-end',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#FF5757',
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF5757',
    fontFamily: 'Poppins-Medium',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginVertical: 24,
    fontFamily: 'Poppins-Regular',
  },
});