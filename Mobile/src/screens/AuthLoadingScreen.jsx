// Mobile/src/screens/AuthLoadingScreen.jsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMisPerfiles } from '../services/perfilMascotaService';

const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // 1. Revisa si hay un token de usuario guardado.
        const userToken = await AsyncStorage.getItem('userToken');

        if (userToken) {
          // 2. Si hay token, el usuario está logueado. Ahora verificamos si tiene mascotas.
          console.log("Usuario autenticado. Verificando perfiles de mascotas...");
          const misPerfiles = await getMisPerfiles();
          
          if (misPerfiles && misPerfiles.length > 0) {
            // 3. Si tiene 1 o más mascotas, llévalo a la app principal.
            console.log(`${misPerfiles.length} mascotas encontradas. Navegando a la app principal.`);
            navigation.replace('MainDrawer'); 
          } else {
            // 4. Si no tiene mascotas, fuérzalo a ir a la pantalla de registro.
            console.log("No se encontraron mascotas. Navegando a la pantalla de registro de mascota.");
            navigation.replace('RegistroMascota');
          }
        } else {
          // 5. Si no hay token, el usuario no está logueado. Llévalo a la pantalla de bienvenida.
          console.log("No hay token. Navegando a Welcome.");
          navigation.replace('Welcome');
        }
      } catch (e) {
        // 6. Si ocurre cualquier error (ej. token inválido, fallo de red), es más seguro enviar al usuario a la pantalla de Login para que se vuelva a autenticar.
        console.error("Error en el proceso de carga:", e);
        await AsyncStorage.removeItem('userToken'); // Limpia un posible token inválido
        navigation.replace('Login');
      }
    };

    // Pequeño delay para que la pantalla de carga sea visible y la transición se sienta más suave.
    setTimeout(bootstrapAsync, 1500);

  }, [navigation]);

  // Esto es lo que el usuario ve mientras se toma la decisión.
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