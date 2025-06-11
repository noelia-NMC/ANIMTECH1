import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import YoRescatoScreen from '../screens/YoRescatoScreen';
import RescatesActivosScreen from '../screens/RescatesActivosScreen';
import ComunidadScreen from '../screens/ComunidadScreen';
import TeleconsultaScreen from '../screens/TeleconsultaScreen';
import ClinicasMapScreen from '../screens/ClinicasMapScreen';

const Drawer = createDrawerNavigator();

const EncabezadoMenu = () => (
  <LinearGradient colors={['#42a8a1', '#3a9691']} style={estilos.encabezadoFondo}>
    <View style={estilos.contenedorEncabezado}>
      <View style={estilos.circuloLogo}>
        <Text style={estilos.textoLogo}>AnimTech</Text>
      </View>
    </View>
  </LinearGradient>
);

const ContenidoPersonalizadoDrawer = (props) => {
  const cerrarSesion = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('welcomeShown'); // opcional si quieres reiniciar onboarding

      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const confirmarCerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que quieres salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí, salir', onPress: cerrarSesion, style: 'destructive' }
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={estilos.contenedorDrawer}>
      <EncabezadoMenu />
      <View style={estilos.espacioSuperior} />
      <DrawerItemList {...props} />
      <DrawerItem
        label="Cerrar Sesión"
        icon={({ color, size }) => (
          <MaterialIcons name="logout" color="#ffffff" size={22} />
        )}
        labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
        onPress={confirmarCerrarSesion}
        style={{ marginTop: 20 }}
      />
    </DrawerContentScrollView>
  );
};

const MainDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        drawerStyle: estilos.estiloDrawer,
        drawerLabelStyle: estilos.textoEtiquetaDrawer,
        drawerActiveBackgroundColor: '#ffffff',
        drawerActiveTintColor: '#42a8a1',
        drawerInactiveTintColor: '#ffffff',
        drawerIcon: ({ focused }) => {
          const iconos = {
            Inicio: 'home',
            'Yo Rescato': 'pets',
            'Ver Rescates': 'search',
            Comunidad: 'people',
            Teleconsulta: 'local-hospital',
            'Clínicas Maps': 'map',
          };
          return (
            <View style={estilos.iconoConEspacio}>
              <MaterialIcons
                name={iconos[route.name]}
                size={22}
                color={focused ? '#42a8a1' : '#ffffff'}
              />
            </View>
          );
        },
      })}
      drawerContent={(props) => <ContenidoPersonalizadoDrawer {...props} />}
    >
      <Drawer.Screen name="Inicio" component={HomeScreen} />
      <Drawer.Screen name="Yo Rescato" component={YoRescatoScreen} />
      <Drawer.Screen name="Ver Rescates" component={RescatesActivosScreen} />
      <Drawer.Screen name="Comunidad" component={ComunidadScreen} />
      <Drawer.Screen name="Teleconsulta" component={TeleconsultaScreen} />
      <Drawer.Screen name="Clínicas Maps" component={ClinicasMapScreen} />
    </Drawer.Navigator>
  );
};

const estilos = StyleSheet.create({
  contenedorDrawer: {
    flex: 1,
  },
  estiloDrawer: {
    backgroundColor: '#42a8a1',
    width: 260,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  textoEtiquetaDrawer: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: -5,
  },
  iconoConEspacio: {
    marginRight: 10,
    paddingLeft: 10,
    width: 30,
    alignItems: 'center',
  },
  encabezadoFondo: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  contenedorEncabezado: {
    alignItems: 'center',
    marginBottom: 10,
  },
  circuloLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoLogo: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  espacioSuperior: {
    height: 15,
  },
});

export default MainDrawer;
