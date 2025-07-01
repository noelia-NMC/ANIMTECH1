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
import EventosScreen from '../screens/EventosScreen.jsx';

import EditUserProfileScreen from '../screens/perfil/EditUserProfileScreen';
import EditPetProfileScreen from '../screens/perfil/EditPetProfileScreen';
import AdiestramientoScreen from '../screens/AdiestramientoScreen.jsx';
import AgregarMascotaScreen from '../screens/AgregarMascotaScreen.jsx';
import ReportesScreen from '../screens/ReportesScreen.jsx';

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
            title: 'Registra tu primera mascota',
            headerLeft: null,
          }}
        />
        <Stack.Screen name="MainDrawer" component={MainDrawer} />
        <Stack.Screen name="Collar" component={CollarScreen} />
        <Stack.Screen name="Teleconsulta" component={TeleconsultaScreen} />
        <Stack.Screen name="ClinicasMap" component={ClinicasMapScreen} />
        <Stack.Screen name="Eventos" component={EventosScreen} />
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

        <Stack.Screen
          name="EditUserProfile"
          component={EditUserProfileScreen}
          options={{
            headerShown: true,
            title: 'Editar mi perfil',
          }}
        />
        <Stack.Screen
          name="EditPetProfile"
          component={EditPetProfileScreen}
          options={{
            headerShown: true,
            title: 'Editar perfil de mascota',
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: true, // Habilita la barra superior
            headerTitle: '', // Oculta el título por defecto
            headerStyle: {
              backgroundColor: '#f4f4f8', // Mismo color de fondo que la pantalla
              elevation: 0, // Sin sombra en Android
              shadowOpacity: 0, // Sin sombra en iOS
            },
            headerLeftContainerStyle: {
              paddingLeft: 10,
            }
          }}
        />
        <Stack.Screen
          name="Adiestramiento"
          component={AdiestramientoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AgregarMascota"
          component={AgregarMascotaScreen}
          options={{
            headerShown: true,
            title: 'Añadir nueva mascota',
          }}
        />
        <Stack.Screen
          name="Reportes"
          component={ReportesScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;