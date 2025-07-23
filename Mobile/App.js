// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { SettingsProvider } from './src/context/SettingsContext';
import { AuthProvider } from './src/context/AuthContext'; // ← AÑADIR ESTA LÍNEA
import { registerRootComponent } from 'expo';
import './src/config/i18n'; // Importar configuración de i18n

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SettingsProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </SettingsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
registerRootComponent(App);