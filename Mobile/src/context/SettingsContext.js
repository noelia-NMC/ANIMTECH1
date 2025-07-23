// src/context/SettingsContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../config/i18n';

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
  language: 'es',
  notifications: {
    eventos: true,
    rescates: false,
  },
  units: {
    temperature: 'C',
  },
  theme: 'light',
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Cargar configuraciones al iniciar
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('app_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        const newSettings = { ...DEFAULT_SETTINGS, ...parsedSettings };
        setSettings(newSettings);
        
        // Aplicar idioma guardado
        if (parsedSettings.language) {
          i18n.changeLanguage(parsedSettings.language);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('app_settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateLanguage = async (language) => {
    const newSettings = { ...settings, language };
    await saveSettings(newSettings);
    i18n.changeLanguage(language);
  };

  const updateNotification = async (type, value) => {
    const newSettings = {
      ...settings,
      notifications: { ...settings.notifications, [type]: value }
    };
    await saveSettings(newSettings);
  };

  const updateTemperatureUnit = async (unit) => {
    const newSettings = {
      ...settings,
      units: { ...settings.units, temperature: unit }
    };
    await saveSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      loading,
      updateLanguage,
      updateNotification,
      updateTemperatureUnit,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};