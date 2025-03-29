import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
  const { theme } = useTheme();

  return (
    <View style={styles.header}>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          {subtitle}
        </Text>
      )}
      <Text style={[styles.title, { color: theme.text }]}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ?
      (StatusBar.currentHeight || 0) + 30 :
      (StatusBar.currentHeight || 0) + 20,
    paddingBottom: 8,
    width: '100%'
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold'
  }
});

export default Header;
