// Mobile/src/navigation/AppNavigator.js - ACTUALIZADO
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// ===== PANTALLAS DE AUTENTICACIÓN ===== 
import AuthLoadingScreen from '../screens/auth/AuthLoadingScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// ===== PANTALLAS MÉDICAS =====
import RegistroMascotaScreen from '../screens/medical/RegistroMascotaScreen';
import HistorialClinicoScreen from '../screens/medical/HistorialClinicoScreen';
import EventosScreen from '../screens/medical/EventosScreen';

// ===== PANTALLAS DE PERFIL =====
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditUserProfileScreen from '../screens/profile/EditUserProfileScreen';
import EditPetProfileScreen from '../screens/profile/EditPetProfileScreen';
import AgregarMascotaScreen from '../screens/profile/AgregarMascotaScreen';

// ===== PANTALLAS DE RESCATE =====
import ReportesScreen from '../screens/rescue/ReportesScreen';
import RescatesMainScreen from '../screens/rescue/RescatesMainScreen';

// ===== PANTALLAS DE COMUNIDAD =====
import TeleconsultaScreen from '../screens/community/TeleconsultaScreen';
// ===== NUEVA PANTALLA DE COMUNIDAD/RED SOCIAL =====
import ComunidadScreen from '../screens/community/ComunidadScreen';
import CommentsScreen from '../screens/community/CommentsScreen';

// ===== PANTALLAS DE MAPAS =====
import ClinicasMapScreen from '../screens/maps/ClinicasMapScreen';

// ===== PANTALLAS DE CONFIGURACIÓN =====
import AjustesScreen from '../screens/settings/AjustesScreen';

// ===== PANTALLAS DE DATOS/ADIESTRAMIENTO =====
import AdiestramientoScreen from '../screens/data/AdiestramientoScreen';

// ===== PANTALLAS DE COLLAR =====
import CollarScreen from '../screens/collar/CollarScreen';
import CollarGraphsScreen from '../screens/collar/CollarGraphsScreen';
import CollarLocationScreen from '../screens/collar/CollarLocationScreen';
import CollarAlertsScreen from '../screens/collar/CollarAlertsScreen';

// ===== NAVEGACIÓN PRINCIPAL =====
import MainDrawer from './MainDrawer';
import ChatbotScreen from '../screens/home/ChatbotScreen';
import CollarHistorialScreen from '../screens/collar/CollarHistorialScreen';

const Stack = createStackNavigator();

// Estilo de header estandarizado
const standardHeaderOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: '#42a8a1',
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTintColor: '#ffffff',
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerTitleAlign: 'center',
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AuthLoading"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        {/* ===== PANTALLAS DE AUTENTICACIÓN ===== */}
        <Stack.Screen
          name="AuthLoading"
          component={AuthLoadingScreen}
          options={{ animationEnabled: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />

        {/* ===== NAVEGACIÓN PRINCIPAL ===== */}
        <Stack.Screen
          name="MainDrawer"
          component={MainDrawer}
          options={{ gestureEnabled: false }}
        />

        {/* ===== PANTALLAS MÉDICAS ===== */}
        <Stack.Screen
          name="RegistroMascota"
          component={RegistroMascotaScreen}
          options={{
            ...standardHeaderOptions,
            title: 'Registra tu primera mascota',
            headerLeft: null,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="HistorialClinico"
          component={HistorialClinicoScreen}
          options={{
            ...standardHeaderOptions,
            title: 'Historial Clínico',
          }}
        />
        <Stack.Screen
          name="Eventos"
          component={EventosScreen}
          options={{
            ...standardHeaderOptions,
            title: 'Calendario de Eventos',
          }}
        />

        {/* ===== PANTALLAS DE PERFIL ===== */}
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: true,
            headerTitle: '',
            headerStyle: {
              backgroundColor: '#f4f4f8',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerLeftContainerStyle: {
              paddingLeft: 10,
            }
          }}
        />
        <Stack.Screen
          name="EditUserProfile"
          component={EditUserProfileScreen}
          options={{
            ...standardHeaderOptions,
            title: 'Editar mi perfil',
          }}
        />
        <Stack.Screen
          name="EditPetProfile"
          component={EditPetProfileScreen}
          options={{
            ...standardHeaderOptions,
            title: 'Editar perfil de mascota',
          }}
        />
        <Stack.Screen
          name="AgregarMascota"
          component={AgregarMascotaScreen}
          options={{
            ...standardHeaderOptions,
            title: 'Añadir nueva mascota',
          }}
        />

        {/* ===== PANTALLAS DE COLLAR ===== */}
        <Stack.Screen
          name="Collar"
          component={CollarScreen}
          options={{
            ...standardHeaderOptions,
            title: 'Collar Inteligente',
          }}
        />
        <Stack.Screen
          name="CollarGraphs"
          component={CollarGraphsScreen}
          options={{
            ...standardHeaderOptions,
            title: 'Gráficos del Collar',
          }}
        />
        <Stack.Screen
          name="CollarLocation"
          component={CollarLocationScreen}
          options={{
            ...standardHeaderOptions,
            title: 'Ubicación GPS',
          }}
        />
        <Stack.Screen
          name="CollarAlerts"
          component={CollarAlertsScreen}
          options={{
            ...standardHeaderOptions,
            title: 'Alertas del Collar',
          }}
        />
        <Stack.Screen
          name="CollarHistorial"
          component={CollarHistorialScreen}
          options={{ title: 'Historial y Reportes' }}
        />

        {/* ===== PANTALLAS DE RESCATE ===== */}
        <Stack.Screen
          name="Reportes"
          component={ReportesScreen}
          options={{
            ...standardHeaderOptions,
            title: 'Mis Reportes',
          }}
        />
        <Stack.Screen
          name="RescatesMain"
          component={RescatesMainScreen}
          options={{
            ...standardHeaderOptions,
            title: 'Centro de Rescates',
          }}
        />

        {/* ===== PANTALLAS DE COMUNIDAD ===== */}
        <Stack.Screen
          name="Teleconsulta"
          component={TeleconsultaScreen}
          options={{
            ...standardHeaderOptions,
            title: 'Teleconsulta Veterinaria',
          }}
        />

        {/* ===== NUEVA PANTALLA DE COMUNIDAD/RED SOCIAL ===== */}
        <Stack.Screen
          name="Comunidad"
          component={ComunidadScreen}
          options={{
            headerShown: false, // Usamos header personalizado en la pantalla
          }}
        />

        {/* ===== PANTALLA DE COMENTARIOS ===== */}
        <Stack.Screen
          name="Comments"
          component={CommentsScreen}
          options={{
            ...standardHeaderOptions,
            title: 'Comentarios',
          }}
        />

        {/* ===== PANTALLAS DE MAPAS ===== */}
        <Stack.Screen
          name="ClinicasMap"
          component={ClinicasMapScreen}
          options={{
            ...standardHeaderOptions,
            title: 'Clínicas Veterinarias',
          }}
        />

        {/* ===== PANTALLAS DE CONFIGURACIÓN ===== */}
        <Stack.Screen
          name="Ajustes"
          component={AjustesScreen}
          options={{
            ...standardHeaderOptions,
            title: 'Configuración',
          }}
        />

        {/* ===== PANTALLAS DE ADIESTRAMIENTO ===== */}
        <Stack.Screen
          name="Adiestramiento"
          component={AdiestramientoScreen}
          options={{
            ...standardHeaderOptions,
            title: 'Guía de Adiestramiento',
          }}
        />

        {/* ===== CHATBOT ===== */}
        <Stack.Screen
          name="Chatbot"
          component={ChatbotScreen}
          options={{
            ...standardHeaderOptions,
            title: 'AnimBot',
          }}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;