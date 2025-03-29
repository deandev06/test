// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Define theme colors and styles
export const lightTheme = {
  background: '#FFFFFF',
  text: '#333333',
  secondaryText: '#666666',
  primary: '#FF5757',
  secondary: '#FFA8A8',
  border: '#EEEEEE',
  inputBackground: '#F5F5F5',
  card: '#FFFFFF',
  inactive: '#CCCCCC',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
};

export const darkTheme = {
  background: '#121212',
  text: '#FFFFFF',
  secondaryText: '#AAAAAA',
  primary: '#FF5757',
  secondary: '#FFA8A8',
  border: '#333333',
  inputBackground: '#2A2A2A',
  card: '#1E1E1E',
  inactive: '#555555',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
};

export type ThemeType = typeof lightTheme;

type ThemeContextType = {
  theme: ThemeType;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDarkMode: false,
  toggleDarkMode: () => {},
  setDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get system color scheme
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Listen for system changes
  useEffect(() => {
    // Optionally respond to system theme changes
    // Uncomment if you want the app to follow system theme
    // setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const setDarkMode = (value: boolean) => setIsDarkMode(value);

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};