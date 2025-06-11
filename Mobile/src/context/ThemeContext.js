import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const lightColors = {
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#111827',
  textSecondary: '#6b7280',
  primary: '#42a8a1',
  border: '#ddd',
  header: '#ffffff',
};

const darkColors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  primary: '#42a8a1',
  border: '#333333',
  header: '#1e1e1e',
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme(); // 'dark' o 'light'
  const [isDarkMode, setIsDarkMode] = useState(systemScheme === 'dark');

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    await AsyncStorage.setItem('theme', newTheme);
  };

  const theme = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);