// Mobile/src/services/historialCollar.js - CORREGIDO PARA MÚLTIPLES USUARIOS
import { ref, push, get, query, orderByChild, startAt, endAt, onValue } from 'firebase/database';
import { db } from '../config/firebaseConfig';
import { getMisPerfiles } from './perfilMascotaService';
import AsyncStorage from '@react-native-async-storage/async-storage';

class HistorialService {
  constructor() {
    this.HISTORIAL_PATH = 'AnimTech/historial';
    this.DEVICE_PATH = 'AnimTech/device01';
    this.activeListener = null;
    this.cachedMascotas = null;
    this.lastUserId = null;
  }

  /**
   * Obtiene el ID del usuario actual
   */
  async obtenerUsuarioActual() {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('No hay usuario autenticado');
      }
      
      // Decodificar el token para obtener el ID del usuario
      const payload = JSON.parse(atob(userToken.split('.')[1]));
      return payload.userId || payload.id || payload.sub;
    } catch (error) {
      console.error('❌ Error obteniendo usuario actual:', error);
      throw new Error('No se pudo obtener el usuario actual');
    }
  }

  /**
   * Obtiene las mascotas del usuario actual y cachea el resultado
   */
  async obtenerMascotasUsuario() {
    try {
      const usuarioActual = await this.obtenerUsuarioActual();
      
      // Si cambió el usuario, limpiar caché
      if (this.lastUserId !== usuarioActual) {
        this.cachedMascotas = null;
        this.lastUserId = usuarioActual;
      }
      
      // Si ya tenemos las mascotas en caché, devolverlas
      if (this.cachedMascotas) {
        return this.cachedMascotas;
      }
      
      // Obtener mascotas del usuario actual
      const perfiles = await getMisPerfiles();
      this.cachedMascotas = perfiles || [];
      
      console.log('🐕 Mascotas del usuario:', this.cachedMascotas.map(m => `${m.nombre} (ID: ${m.id})`));
      return this.cachedMascotas;
      
    } catch (error) {
      console.error('❌ Error obteniendo mascotas del usuario:', error);
      return [];
    }
  }

  /**
   * Obtiene el nombre de una mascota específica por su ID o collar_id
   */
  async obtenerNombreMascota(mascotaId = null, collarId = null) {
    try {
      const mascotas = await this.obtenerMascotasUsuario();
      
      if (mascotas.length === 0) {
        return 'Mi mascota';
      }
      
      let mascotaEncontrada = null;
      
      // Buscar por ID específico de mascota
      if (mascotaId) {
        mascotaEncontrada = mascotas.find(m => m.id === mascotaId);
      }
      
      // Buscar por collar_id
      if (!mascotaEncontrada && collarId) {
        mascotaEncontrada = mascotas.find(m => m.collar_id === collarId);
      }
      
      // Si no se encuentra por ID específico, buscar la primera que tenga collar vinculado
      if (!mascotaEncontrada) {
        mascotaEncontrada = mascotas.find(m => m.collar_id && m.collar_id.trim() !== '');
      }
      
      // Si aún no hay ninguna, tomar la primera
      if (!mascotaEncontrada) {
        mascotaEncontrada = mascotas[0];
      }
      
      const nombre = mascotaEncontrada?.nombre || 'Mi mascota';
      console.log('🎯 Mascota seleccionada:', nombre, '- ID:', mascotaEncontrada?.id, '- Collar:', mascotaEncontrada?.collar_id);
      
      return nombre;
      
    } catch (error) {
      console.error('❌ Error obteniendo nombre de mascota:', error);
      return 'Mi mascota';
    }
  }

  /**
   * Obtiene la mascota que tiene collar vinculado
   */
  async obtenerMascotaConCollar() {
    try {
      const mascotas = await this.obtenerMascotasUsuario();
      
      // Buscar la primera mascota que tenga collar_id
      const mascotaConCollar = mascotas.find(m => m.collar_id && m.collar_id.trim() !== '');
      
      if (mascotaConCollar) {
        console.log('🔗 Mascota con collar encontrada:', mascotaConCollar.nombre, '- Collar:', mascotaConCollar.collar_id);
        return mascotaConCollar;
      }
      
      // Si no hay collar vinculado, devolver la primera mascota
      if (mascotas.length > 0) {
        console.log('⚠️ No hay collar vinculado. Usando primera mascota:', mascotas[0].nombre);
        return mascotas[0];
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error obteniendo mascota con collar:', error);
      return null;
    }
  }

  /**
   * Guarda automáticamente los datos del collar en Firebase por fechas
   * Estructura: AnimTech/historial/YYYY-MM-DD/timestamp
   */
  async guardarDatosCollar(datosRaw) {
    try {
      console.log('📊 Datos recibidos para guardar:', datosRaw);
      
      const usuarioActual = await this.obtenerUsuarioActual();
      const mascotaConCollar = await this.obtenerMascotaConCollar();
      
      if (!mascotaConCollar) {
        console.log('⚠️ No hay mascota vinculada para guardar datos');
        return { success: false, error: 'No hay mascota vinculada' };
      }
      
      const ahora = new Date();
      const fecha = ahora.toISOString().split('T')[0]; // YYYY-MM-DD
      const timestamp = ahora.toISOString();
      
      const registro = {
        // Datos del collar procesados
        temperatura: {
          mascota: Number(datosRaw.temperatura?.mascota || 0) / 100,
          ambiente: Number(datosRaw.temperatura?.ambiente || 0) / 100,
          diferencia: (Number(datosRaw.temperatura?.mascota || 0) - Number(datosRaw.temperatura?.ambiente || 0)) / 100
        },
        sonido: Number(datosRaw.sonido || 0),
        ubicacion: {
          latitud: Number(datosRaw.posicion?.latitud || -17.381569),
          longitud: Number(datosRaw.posicion?.longitud || -66.165263),
          coordenadas: datosRaw.posicion?.Coordenadas || `${datosRaw.posicion?.latitud || -17.381569}, ${datosRaw.posicion?.longitud || -66.165263}`
        },
        
        // Metadatos con información del usuario y mascota
        timestamp: timestamp,
        fecha: fecha,
        hora: ahora.toTimeString().split(' ')[0], // HH:MM:SS
        dispositivo: 'device01',
        usuarioId: usuarioActual,
        mascotaId: mascotaConCollar.id,
        mascotaNombre: mascotaConCollar.nombre,
        collarId: mascotaConCollar.collar_id || 'device01'
      };

      // Guardar en la ruta por fecha y usuario
      const rutaHistorial = `${this.HISTORIAL_PATH}/${usuarioActual}/${fecha}`;
      const historialRef = ref(db, rutaHistorial);
      
      await push(historialRef, registro);
      
      console.log('✅ Datos guardados en Firebase:', {
        usuario: usuarioActual,
        mascota: mascotaConCollar.nombre,
        fecha: fecha,
        hora: registro.hora,
        temp: registro.temperatura.mascota,
        sonido: registro.sonido
      });

      return { success: true, registro };
    } catch (error) {
      console.error('❌ Error guardando en Firebase:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Inicia el monitoreo automático del collar para guardar datos
   */
  iniciarGuardadoAutomatico() {
    console.log('🔄 Iniciando guardado automático...');
    
    const deviceRef = ref(db, this.DEVICE_PATH);
    
    this.activeListener = onValue(deviceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Solo guardar si hay datos válidos
        if (data.temperatura?.mascota || data.sonido !== undefined) {
          this.guardarDatosCollar(data);
        }
      }
    }, (error) => {
      console.error('❌ Error en monitoreo automático:', error);
    });

    return this.activeListener;
  }

  /**
   * Detiene el guardado automático
   */
  detenerGuardadoAutomatico() {
    if (this.activeListener) {
      this.activeListener = null;
      console.log('⏹️ Guardado automático detenido');
    }
  }

  /**
   * Obtiene datos de historial por rango de fechas del usuario actual
   */
  async obtenerHistorialPorFechas(fechaInicio, fechaFin) {
    try {
      console.log('🔍 Buscando datos desde', fechaInicio, 'hasta', fechaFin);
      
      const usuarioActual = await this.obtenerUsuarioActual();
      const todos_los_datos = [];
      
      // Obtener datos para cada fecha en el rango
      const fecha_actual = new Date(fechaInicio);
      const fecha_final = new Date(fechaFin);
      
      while (fecha_actual <= fecha_final) {
        const fecha_str = fecha_actual.toISOString().split('T')[0];
        
        try {
          const rutaFecha = `${this.HISTORIAL_PATH}/${usuarioActual}/${fecha_str}`;
          const snapshot = await get(ref(db, rutaFecha));
          
          if (snapshot.exists()) {
            const datos_fecha = snapshot.val();
            
            // Convertir los datos y agregar la clave como id
            Object.keys(datos_fecha).forEach(key => {
              todos_los_datos.push({
                id: key,
                ...datos_fecha[key]
              });
            });
          }
        } catch (error) {
          console.log(`⚠️ No hay datos para la fecha ${fecha_str}`);
        }
        
        // Avanzar al siguiente día
        fecha_actual.setDate(fecha_actual.getDate() + 1);
      }

      // Ordenar por timestamp (más reciente primero)
      todos_los_datos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      console.log('📊 Total de registros encontrados para usuario', usuarioActual + ':', todos_los_datos.length);
      return todos_los_datos;
      
    } catch (error) {
      console.error('❌ Error obteniendo historial:', error);
      return [];
    }
  }

  /**
   * Obtiene datos de una fecha específica del usuario actual
   */
  async obtenerDatosPorFecha(fecha) {
    try {
      const usuarioActual = await this.obtenerUsuarioActual();
      const rutaFecha = `${this.HISTORIAL_PATH}/${usuarioActual}/${fecha}`;
      const snapshot = await get(ref(db, rutaFecha));
      
      if (!snapshot.exists()) {
        return [];
      }

      const datos = snapshot.val();
      const registros = Object.keys(datos).map(key => ({
        id: key,
        ...datos[key]
      }));

      // Ordenar por hora
      return registros.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
    } catch (error) {
      console.error('❌ Error obteniendo datos por fecha:', error);
      return [];
    }
  }

  /**
   * Obtiene estadísticas básicas de un rango de fechas del usuario actual
   */
  async obtenerEstadisticas(fechaInicio, fechaFin) {
    try {
      const datos = await this.obtenerHistorialPorFechas(fechaInicio, fechaFin);
      
      if (datos.length === 0) {
        return {
          totalRegistros: 0,
          mensaje: 'No hay datos para el período seleccionado'
        };
      }

      const temperaturas = datos.map(d => d.temperatura.mascota).filter(t => t > 0);
      const sonidos = datos.map(d => d.sonido).filter(s => s >= 0);

      return {
        totalRegistros: datos.length,
        temperatura: {
          promedio: temperaturas.reduce((a, b) => a + b, 0) / temperaturas.length,
          minima: Math.min(...temperaturas),
          maxima: Math.max(...temperaturas)
        },
        sonido: {
          promedio: sonidos.reduce((a, b) => a + b, 0) / sonidos.length,
          minimo: Math.min(...sonidos),
          maximo: Math.max(...sonidos)
        },
        periodo: { inicio: fechaInicio, fin: fechaFin }
      };
      
    } catch (error) {
      console.error('❌ Error calculando estadísticas:', error);
      return { error: 'Error al calcular estadísticas' };
    }
  }

  /**
   * Prepara datos para generar reporte del usuario actual
   */
  async prepararDatosReporte(fechaInicio, fechaFin) {
    try {
      const datos = await this.obtenerHistorialPorFechas(fechaInicio, fechaFin);
      const estadisticas = await this.obtenerEstadisticas(fechaInicio, fechaFin);
      const mascotaConCollar = await this.obtenerMascotaConCollar();
      const nombreMascota = mascotaConCollar?.nombre || 'Mi mascota';

      return {
        registros: datos,
        estadisticas: estadisticas,
        periodo: {
          inicio: fechaInicio,
          fin: fechaFin,
          totalDias: Math.ceil((new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24)) + 1
        },
        metadatos: {
          fechaGeneracion: new Date().toISOString(),
          dispositivo: 'AnimTech Collar',
          version: '1.0.0',
          nombreMascota: nombreMascota,
          mascotaId: mascotaConCollar?.id,
          usuarioId: await this.obtenerUsuarioActual()
        }
      };
    } catch (error) {
      console.error('❌ Error preparando datos para reporte:', error);
      return null;
    }
  }

  /**
   * Limpia el caché cuando el usuario cambia
   */
  limpiarCache() {
    this.cachedMascotas = null;
    this.lastUserId = null;
    console.log('🧹 Caché limpiado');
  }
}

// Exportar instancia única
export default new HistorialService();