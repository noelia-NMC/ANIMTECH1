// Mobile/src/services/http.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración base de axios
const API = axios.create({
  //casa noe laptop
  //baseURL: 'http://192.168.100.23:4000/api',

  //movil noelia
  baseURL: 'http://10.250.105.244:4000/api',

  //daza laptop
  //baseURL: 'http://192.168.100.34:4000/api',

  //chico
  //baseURL: 'http://192.168.85.244:4000/api',

  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para incluir el token automáticamente
API.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error obteniendo token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
      // Aquí podrías disparar una navegación al login si tienes acceso
    }
    return Promise.reject(error);
  }
);

export default API;