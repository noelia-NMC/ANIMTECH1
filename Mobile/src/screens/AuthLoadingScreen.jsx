// ✅ Mobile/src/screens/AuthLoadingScreen.jsx - versión segura sin bucle
import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMisPerfiles } from '../services/perfilMascotaService';

const AuthLoadingScreen = ({ navigation }) => {
  const yaNavego = useRef(false);

  useEffect(() => {
    const bootstrapAsync = async () => {
      if (yaNavego.current) return;
      yaNavego.current = true;

      try {
        const userToken = await AsyncStorage.getItem('userToken');

        if (userToken) {
          console.log("Usuario autenticado. Verificando perfiles de mascotas...");
          const misPerfiles = await getMisPerfiles();

          if (misPerfiles && misPerfiles.length > 0) {
            console.log(`${misPerfiles.length} mascotas encontradas. Navegando a la app principal.`);
            navigation.replace('MainDrawer'); 
          } else {
            console.log("No se encontraron mascotas. Navegando a la pantalla de registro de mascota.");
            navigation.replace('RegistroMascota');
          }
        } else {
          console.log("No hay token. Navegando a Welcome.");
          navigation.replace('Welcome');
        }
      } catch (e) {
        console.error("Error en el proceso de carga:", e);
        await AsyncStorage.removeItem('userToken');
        navigation.replace('Login');
      }
    };

    setTimeout(bootstrapAsync, 1500);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007bff" />
      <Text style={styles.loadingText}>Cargando tu sesión...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f8f9fa'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6c757d'
  }
});

export default AuthLoadingScreen;
