import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

import RegistroMascotaScreen from '../screens/RegistroMascotaScreen';

import MainDrawer from './MainDrawer'; 
import ProfileScreen from '../screens/ProfileScreen';
import CollarScreen from '../screens/CollarScreen';
import TeleconsultaScreen from '../screens/TeleconsultaScreen';
import ClinicasMapScreen from '../screens/ClinicasMapScreen';
import AjustesScreen from '../screens/perfil/AjustesScreen.jsx'; 
import HistorialClinicoScreen from '../screens/HistorialClinicoScreen'; 


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="AuthLoading"
        screenOptions={{ headerShown: false }}
      >
        {/* Pantallas de Autenticación */}
        <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        
        {/* Pantalla de Registro de Mascota */}
        <Stack.Screen 
          name="RegistroMascota" 
          component={RegistroMascotaScreen} 
          options={{ 
            headerShown: true,
            title: 'Registra tu primera Mascota',
            headerLeft: null,
          }} 
        />
        <Stack.Screen name="MainDrawer" component={MainDrawer} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Collar" component={CollarScreen} />
        <Stack.Screen name="Teleconsulta" component={TeleconsultaScreen} />
        <Stack.Screen name="ClinicasMap" component={ClinicasMapScreen} />

        <Stack.Screen 
          name="Ajustes" 
          component={AjustesScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="HistorialClinico" 
          component={HistorialClinicoScreen} 
          options={{ headerShown: false }} 
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;