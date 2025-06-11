import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// RECUERDA PONER TU IP LOCAL AQUÍ
const API = axios.create({
  //casa
  //baseURL: 'http://192.168.100.23:4000/api',
  //movil
  baseURL: 'http://192.168.142.73:4000/api',
  timeout: 10000,
});

// Interceptor para inyectar el token en cada petición
API.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;