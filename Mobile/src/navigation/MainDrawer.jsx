// src/navigation/MainDrawer.jsx

import React, { useState, useCallback } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  Image, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { getMiPerfilUsuario } from '../services/userService'; 
import { getMisPerfiles } from '../services/perfilMascotaService'; 

// Importación de Pantallas
import HomeScreen from '../screens/home/HomeScreen';
import YoRescatoScreen from '../screens/rescue/YoRescatoScreen';
import RescatesActivosScreen from '../screens/rescue/RescatesMainScreen';
import ComunidadScreen from '../screens/community/ComunidadScreen';
import TeleconsultaScreen from '../screens/community/TeleconsultaScreen';
import ClinicasMapScreen from '../screens/maps/ClinicasMapScreen';

const Drawer = createDrawerNavigator();

const colors = {
  primary: '#42a8a1',
  primaryDark: '#239089',
  background: '#1c4a45', 
  white: '#ffffff',
  inactive: 'rgba(255, 255, 255, 0.65)',
  active: '#ffffff',
  activeBackground: 'rgba(255, 255, 255, 0.1)',
  separator: 'rgba(255, 255, 255, 0.15)',
  orb1: '#8ae0db', 
  orb2: '#5dc1b9',
};

const DrawerProfileHeader = () => {
  const [usuario, setUsuario] = useState(null);
  const [mascota, setMascota] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (!loading) setLoading(true); 
        try {
          const [userData, petData] = await Promise.all([ 
            getMiPerfilUsuario(), 
            getMisPerfiles() 
          ]);
          setUsuario(userData);
          setMascota(petData?.[0] || null);
        } catch (error) {
          console.error("Error cargando datos para el Drawer Header:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  return (
    <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Image
                    source={{ uri: mascota?.foto_url || 'https://cdn-icons-png.flaticon.com/512/616/616554.png' }}
                    style={styles.headerAvatar}
                />
              )}
            </View>
            <View style={styles.headerTextContainer}>
                <Text numberOfLines={1} style={styles.headerPetName}>
                  {loading ? 'Cargando...' : mascota?.nombre || 'Mi Mascota'}
                </Text>
                <Text numberOfLines={1} style={styles.headerUserName}>
                  {loading ? ' ' : `Prop: ${usuario?.nombre || 'Tú'}`}
                </Text>
            </View>
        </View>
        <View style={styles.headerSeparator} />
    </View>
  );
};

const CustomDrawerContent = (props) => {
  const logout = async () => {
      try { 
        await AsyncStorage.multiRemove(['userToken', 'welcomeShown']); 
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0, 
            routes: [{ name: 'Login' }]
          })
        );
      } catch (error) { 
        console.error('Error al cerrar sesión:', error);
      }
  };
  
  const confirmLogout = () => { 
    Alert.alert(
      'Cerrar sesión', 
      '¿Estás seguro de que quieres salir?', 
      [
        { text: 'Cancelar', style: 'cancel' }, 
        { text: 'Sí, salir', onPress: logout, style: 'destructive' }
      ] 
    );
  };

  return (
    <View style={styles.drawerContainer}>
        <View style={[styles.lightOrb, styles.orb1]}/>
        <View style={[styles.lightOrb, styles.orb2]}/>

        <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
            <DrawerProfileHeader />
            <View style={styles.drawerItemsContainer}>
            <DrawerItemList {...props} />
            </View>
        </DrawerContentScrollView>

        <View style={styles.footer}>
            <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
                <Ionicons name="log-out-outline" color={colors.inactive} size={22} />
                <Text style={styles.logoutLabel}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

const screenIcons = {
  'Inicio': 'home', 
  'Collar Inteligente': 'watch',
  'Yo Rescato': 'megaphone', 
  'Ver Rescates': 'search', 
  'Comunidad': 'people', 
  'Teleconsulta': 'medkit', 
  'Clínicas Maps': 'map'
};

const MainDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        drawerStyle: styles.drawer,
        drawerActiveTintColor: colors.active,
        drawerInactiveTintColor: colors.inactive,
        drawerActiveBackgroundColor: 'transparent',
        drawerItemStyle: styles.drawerItem,
        drawerLabelStyle: styles.drawerLabel,
        drawerIcon: ({ focused, color, size }) => {
          const iconName = screenIcons[route.name] || 'alert-circle';
          return (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Ionicons 
                  name={focused ? iconName : `${iconName}-outline`} 
                  size={focused ? size-2 : size} 
                  color={focused ? colors.primaryDark : color} 
                />
            </View>
          );
        },
      })}
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

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  lightOrb: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  orb1: {
    top: -150,
    left: -200,
    backgroundColor: colors.orb1,
    opacity: 0.15,
  },
  orb2: {
    bottom: -100,
    right: -250,
    backgroundColor: colors.orb2,
    opacity: 0.2,
  },
  drawer: {
    backgroundColor: 'transparent',
    width: 285,
    borderRightWidth: 0,
  },
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  avatarContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.activeBackground,
    padding: 3,
  },
  headerAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 31,
  },
  headerTextContainer:{
      flex: 1,
  },
  headerPetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  headerUserName: {
    fontSize: 14,
    color: colors.inactive,
  },
  headerSeparator: {
    height: 1,
    backgroundColor: colors.separator,
    marginTop: 25,
  },
  drawerItemsContainer: {
      paddingTop: 10,
  },
  drawerItem: {
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 16,
    paddingHorizontal: 4,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 10,
  },
  iconContainerActive: {
      backgroundColor: colors.white,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      paddingBottom: 40,
      borderTopWidth: 1,
      borderTopColor: colors.separator,
  },
  logoutButton:{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.separator,
  },
  logoutLabel: {
      color: colors.inactive,
      fontWeight: '600',
      fontSize: 15,
  },
});

export default MainDrawer;