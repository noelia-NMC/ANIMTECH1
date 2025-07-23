// src/navigation/TabsNavigator.jsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CollarScreen from '../screens/collar/CollarScreen';
import CollarAlertsScreen from '../screens/collar/CollarAlertsScreen';
import YoRescatoScreen from '../screens/rescue/YoRescatoScreen';
import RescatesActivosScreen from '../screens/rescue/RescatesActivosScreen';
import TeleconsultaScreen from '../screens/community/TeleconsultaScreen';
import ClinicasMapScreen from '../screens/maps/ClinicasMapScreen';

const Tab = createBottomTabNavigator();

const TabsNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const icons = {
          'Collar': 'dog-side',
          'Alertas': 'alert-circle-outline',
          'Rescates': 'map-marker-radius-outline',
          'Publicar': 'plus-circle-outline',
          'Teleconsulta': 'medkit-outline',
          'Clínicas Maps': 'map-outline',
        };
        return <Icon name={icons[route.name]} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#42a8a1',
      tabBarInactiveTintColor: '#aaa',
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        height: 60,
        paddingBottom: 5,
        paddingTop: 5,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
      headerShown: false,
    })}
  >
    <Tab.Screen 
      name="Collar" 
      component={CollarScreen}
      options={{
        tabBarLabel: 'Collar',
      }}
    />
    <Tab.Screen 
      name="Alertas" 
      component={CollarAlertsScreen}
      options={{
        tabBarLabel: 'Alertas',
      }}
    />
    <Tab.Screen 
      name="Rescates" 
      component={RescatesActivosScreen}
      options={{
        tabBarLabel: 'Rescates',
      }}
    />
    <Tab.Screen 
      name="Publicar" 
      component={YoRescatoScreen}
      options={{
        tabBarLabel: 'Publicar',
      }}
    />
    <Tab.Screen 
      name="Teleconsulta" 
      component={TeleconsultaScreen}
      options={{
        tabBarLabel: 'Consulta',
      }}
    />
    <Tab.Screen 
      name="Clínicas Maps" 
      component={ClinicasMapScreen}
      options={{
        tabBarLabel: 'Clínicas',
      }}
    />
  </Tab.Navigator>
);

export default TabsNavigator;