// src/services/clinicaService.js
import API from './http';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache en memoria para búsquedas recientes
const memoryCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos en memoria
const STORAGE_CACHE_DURATION = 30 * 60 * 1000; // 30 minutos en AsyncStorage

/**
 * Genera una clave única para el cache basada en coordenadas
 */
const generateCacheKey = (lat, lng) => {
  // Redondeamos a 3 decimales para agrupar búsquedas cercanas
  const roundedLat = Math.round(lat * 1000) / 1000;
  const roundedLng = Math.round(lng * 1000) / 1000;
  return `clinicas_${roundedLat}_${roundedLng}`;
};

/**
 * Verifica si los datos del cache siguen siendo válidos
 */
const isCacheValid = (timestamp, maxAge) => {
  return Date.now() - timestamp < maxAge;
};

/**
 * Guarda datos en AsyncStorage con timestamp
 */
const saveToStorage = async (key, data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Error guardando en storage:', error);
  }
};

/**
 * Obtiene datos de AsyncStorage si son válidos
 */
const getFromStorage = async (key) => {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (isCacheValid(timestamp, STORAGE_CACHE_DURATION)) {
        return data;
      }
      // Si expiró, lo eliminamos
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    console.warn('Error leyendo storage:', error);
  }
  return null;
};

/**
 * ✅ Busca clínicas usando TU BACKEND con cache optimizado
 */
export const getOSMNearbyClinicas = async (lat, lng) => {
  const cacheKey = generateCacheKey(lat, lng);
  
  // 1. Verificar cache en memoria (más rápido)
  const memoryCached = memoryCache.get(cacheKey);
  if (memoryCached && isCacheValid(memoryCached.timestamp, CACHE_DURATION)) {
    console.log('📦 Clínicas obtenidas del cache en memoria');
    return memoryCached.data;
  }

  // 2. Verificar AsyncStorage
  const storageCached = await getFromStorage(cacheKey);
  if (storageCached) {
    console.log('💾 Clínicas obtenidas del cache en storage');
    // Guardamos en memoria para próximas consultas
    memoryCache.set(cacheKey, {
      data: storageCached,
      timestamp: Date.now()
    });
    return storageCached;
  }

  // 3. ✅ Petición a TU BACKEND
  console.log('🌐 Consultando clínicas desde TU backend...');
  
  try {
    const response = await API.get('/clinicas/osm-nearby', { 
      params: { lat, lng },
      timeout: 15000, // Timeout aumentado para estabilidad
    });

    const data = response.data;

    // 4. Guardar en ambos caches
    memoryCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    await saveToStorage(cacheKey, data);

    console.log(`✅ ${data.length} clínicas cargadas desde backend y guardadas en cache`);
    return data;

  } catch (error) {
    console.error('❌ Error cargando clínicas desde backend:', error.message);
    
    // 5. Fallback: datos expirados como último recurso
    try {
      const expiredCache = await AsyncStorage.getItem(cacheKey);
      if (expiredCache) {
        const { data } = JSON.parse(expiredCache);
        console.log('⚠️ Usando datos expirados del cache como fallback');
        return data;
      }
    } catch (fallbackError) {
      console.warn('Error en fallback:', fallbackError);
    }

    // 6. ✅ Fallback final: datos de respaldo locales
    console.log('🔄 Usando datos de respaldo locales');
    return getClinicasRespaldo(lat, lng);
  }
};

/**
 * ✅ Datos de respaldo locales para casos de emergencia
 */
const getClinicasRespaldo = (lat, lng) => {
  const clinicasRespaldo = [
    {
      id: 'resp_1',
      nombre: 'Clínica Veterinaria Central',
      direccion: 'Av. Heroínas, Cochabamba',
      latitude: -17.3895,
      longitude: -66.1568,
      telefono: '+591 4 4258963',
      tipo: 'veterinary',
      fuente: 'Respaldo'
    },
    {
      id: 'resp_2',
      nombre: 'Veterinaria San Martín',
      direccion: 'Calle San Martín, Cochabamba',
      latitude: -17.3925,
      longitude: -66.1545,
      telefono: '+591 4 4447892',
      tipo: 'veterinary',
      fuente: 'Respaldo'
    },
    {
      id: 'resp_3',
      nombre: 'Clínica Veterinaria Bolívar',
      direccion: 'Av. Bolívar, Cochabamba',
      latitude: -17.3865,
      longitude: -66.1598,
      telefono: '+591 4 4225471',
      tipo: 'veterinary',
      fuente: 'Respaldo'
    },
    {
      id: 'resp_4',
      nombre: 'Pet Shop El Dorado',
      direccion: 'Calle El Dorado, Cochabamba',
      latitude: -17.3845,
      longitude: -66.1478,
      telefono: '+591 4 4336699',
      tipo: 'pet_shop',
      fuente: 'Respaldo'
    },
    {
      id: 'resp_5',
      nombre: 'Clínica Veterinaria Quillacollo',
      direccion: 'Plaza Principal, Quillacollo',
      latitude: -17.3925,
      longitude: -66.2825,
      telefono: '+591 4 4365874',
      tipo: 'veterinary',
      fuente: 'Respaldo'
    }
  ];

  // Calcular distancias
  const conDistancia = clinicasRespaldo.map(clinica => ({
    ...clinica,
    distancia: Math.round(calcularDistancia(lat, lng, clinica.latitude, clinica.longitude))
  }));

  // Filtrar por proximidad razonable (menos de 20km)
  const cercanas = conDistancia.filter(c => c.distancia <= 20000);
  
  // Ordenar por distancia
  return cercanas.sort((a, b) => a.distancia - b.distancia);
};

/**
 * Calcula la distancia entre dos puntos geográficos
 */
const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
           Math.cos(φ1) * Math.cos(φ2) *
           Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Limpia el cache cuando sea necesario
 */
export const clearClinicasCache = async () => {
  try {
    memoryCache.clear();
    const keys = await AsyncStorage.getAllKeys();
    const clinicasKeys = keys.filter(key => key.startsWith('clinicas_'));
    await AsyncStorage.multiRemove(clinicasKeys);
    console.log('🧹 Cache de clínicas limpiado');
  } catch (error) {
    console.warn('Error limpiando cache:', error);
  }
};

/**
 * Precarga clínicas para una ubicación
 */
export const preloadClinicas = async (lat, lng) => {
  try {
    await getOSMNearbyClinicas(lat, lng);
    console.log('🚀 Clínicas precargadas');
  } catch (error) {
    console.warn('Error precargando clínicas:', error);
  }
};