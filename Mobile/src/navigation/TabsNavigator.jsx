import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CollarScreen from '../screens/CollarScreen';
import CollarAlertsScreen from '../screens/CollarAlertsScreen';
import YoRescatoScreen from '../screens/YoRescatoScreen';
import RescatesActivosScreen from '../screens/RescatesActivosScreen';
import TeleconsultaScreen from '../screens/TeleconsultaScreen';
import ClinicasMapScreen from '../screens/ClinicasMapScreen';

const Tab = createBottomTabNavigator();

const TabsNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const icons = {
          Collar: 'dog-side',
          Alertas: 'alert-circle-outline',
          Rescates: 'map-marker-radius-outline',
          Publicar: 'plus-circle-outline',
        };
        return <Icon name={icons[route.name]} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#42a8a1',
      tabBarInactiveTintColor: '#aaa',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Collar" component={CollarScreen} />
    <Tab.Screen name="Alertas" component={CollarAlertsScreen} />
    <Tab.Screen name="Rescates" component={RescatesActivosScreen} />
    <Tab.Screen name="Publicar" component={YoRescatoScreen} />
    <Tab.Screen name="Teleconsulta" component={TeleconsultaScreen} />
    <Tab.Screen name="Clínicas Maps" component={ClinicasMapScreen} />

  </Tab.Navigator>
);

export default TabsNavigator;
