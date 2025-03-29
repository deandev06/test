import React from 'react';
import { StyleSheet, Switch, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Bell, Moon, Clock, Users, HelpCircle, LogOut } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { View, Text, ScrollView } from '@/components/Themed';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, theme } = useTheme();
  const [notifications, setNotifications] = React.useState(true);

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    value?: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: theme.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <Text style={styles.settingTitle}>{title}</Text>
      <View style={styles.settingValue}>{value}</View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { fontFamily: 'Poppins-SemiBold' }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: 'Poppins-SemiBold' }]}>App Settings</Text>

          {renderSettingItem(
            <Bell size={24} color="#FF5757" />,
            "Notifications",
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: theme.inactive, true: "#FFA8A8" }}
              thumbColor={notifications ? "#FF5757" : theme.inputBackground}
            />
          )}

          {renderSettingItem(
            <Moon size={24} color="#FF5757" />,
            "Dark Mode",
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: theme.inactive, true: "#FFA8A8" }}
              thumbColor={isDarkMode ? "#FF5757" : theme.inputBackground}
            />
          )}

          {renderSettingItem(
            <Clock size={24} color="#FF5757" />,
            "Workout Reminders",
            <Text style={[styles.settingSubtitle, { color: theme.secondaryText }]}>Daily at 6:00 PM</Text>,
            () => console.log("Workout reminders pressed")
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: 'Poppins-SemiBold' }]}>Account</Text>

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

        <TouchableOpacity style={[styles.logoutButton, { borderColor: "#FF5757" }]}>
          <LogOut size={20} color="#FF5757" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: theme.secondaryText }]}>Version 1.0.0</Text>
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
    textAlign: 'center',
  },
  section: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
  },
  settingValue: {
    alignItems: 'flex-end',
  },
  settingSubtitle: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderWidth: 1,
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
    fontSize: 14,
    marginVertical: 24,
  },
});