// Mobile/src/services/firebaseHistorialService.js
import { ref, push, query, orderByChild, startAt, endAt, once, onValue } from 'firebase/database';
import { db } from '../config/firebaseConfig';

class FirebaseHistorialService {
  constructor() {
    this.HISTORIAL_PATH = 'AnimTech/historial';
    this.DEVICE_PATH = 'AnimTech/device01';
  }

  /**
   * Guarda datos del collar en el historial
   */
  async guardarDatosHistorial(datos) {
    try {
      const timestamp = new Date().toISOString();
      const fecha = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const hora = new Date().toLocaleTimeString('es-ES', { hour12: false });

      const registroHistorial = {
        // Datos de los sensores
        temperatura: {
          mascota: this.procesarTemperatura(datos.temperatura?.mascota || 0),
          ambiente: this.procesarTemperatura(datos.temperatura?.ambiente || 0),
          diferencia: 0
        },
        sonido: Number(datos.sonido) || 0,
        posicion: {
          latitud: Number(datos.posicion?.latitud) || -17.381592,
          longitud: Number(datos.posicion?.longitud) || -66.165220,
          coordenadas: datos.posicion?.Coordenadas || ''
        },
        
        // Metadatos temporales
        timestamp: timestamp,
        fecha: fecha,
        hora: hora,
        dia: new Date().getDate(),
        mes: new Date().getMonth() + 1,
        año: new Date().getFullYear(),
        diaSemana: new Date().getDay(),
        
        // Datos interpretados
        estadoSalud: this.interpretarEstadoSalud(datos),
        comportamiento: this.interpretarComportamiento(Number(datos.sonido) || 0),
        
        // ID del dispositivo
        deviceId: 'device01'
      };

      // Calcular diferencia térmica
      registroHistorial.temperatura.diferencia = 
        registroHistorial.temperatura.mascota - registroHistorial.temperatura.ambiente;

      // Guardar en la estructura: historial/YYYY/MM/DD/registro
      const rutaHistorial = `${this.HISTORIAL_PATH}/${registroHistorial.año}/${registroHistorial.mes.toString().padStart(2, '0')}/${fecha}`;
      const historialRef = ref(db, rutaHistorial);
      
      await push(historialRef, registroHistorial);
      
      console.log('✅ Datos guardados en historial:', {
        fecha: registroHistorial.fecha,
        hora: registroHistorial.hora,
        temp: registroHistorial.temperatura.mascota,
        sonido: registroHistorial.sonido
      });

      return true;
    } catch (error) {
      console.error('❌ Error guardando en historial:', error);
      return false;
    }
  }

  /**
   * Obtiene datos por rango de fechas
   */
  async obtenerDatosPorRango(fechaInicio, fechaFin, limite = 100) {
    try {
      const datos = [];
      const fechaInicioISO = new Date(fechaInicio).toISOString().split('T')[0];
      const fechaFinISO = new Date(fechaFin).toISOString().split('T')[0];

      // Query por rango de fechas
      const historialRef = ref(db, this.HISTORIAL_PATH);
      const consulta = query(
        historialRef,
        orderByChild('fecha'),
        startAt(fechaInicioISO),
        endAt(fechaFinISO)
      );

      const snapshot = await once(consulta);
      const datosRaw = snapshot.val();

      if (datosRaw) {
        // Procesar datos anidados por año/mes/día
        Object.keys(datosRaw).forEach(año => {
          Object.keys(datosRaw[año]).forEach(mes => {
            Object.keys(datosRaw[año][mes]).forEach(fecha => {
              Object.keys(datosRaw[año][mes][fecha]).forEach(id => {
                const registro = datosRaw[año][mes][fecha][id];
                if (registro.fecha >= fechaInicioISO && registro.fecha <= fechaFinISO) {
                  datos.push({
                    id: id,
                    ...registro
                  });
                }
              });
            });
          });
        });
      }

      // Ordenar por timestamp y limitar
      return datos
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limite);

    } catch (error) {
      console.error('❌ Error obteniendo datos por rango:', error);
      return [];
    }
  }

  /**
   * Obtiene datos de hoy
   */
  async obtenerDatosHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    return await this.obtenerDatosPorRango(hoy, hoy);
  }

  /**
   * Obtiene datos de la última semana
   */
  async obtenerDatosSemana() {
    const hoy = new Date();
    const semanaAtras = new Date(hoy.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    return await this.obtenerDatosPorRango(
      semanaAtras.toISOString().split('T')[0],
      hoy.toISOString().split('T')[0]
    );
  }

  /**
   * Obtiene datos del último mes
   */
  async obtenerDatosMes() {
    const hoy = new Date();
    const mesAtras = new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate());
    
    return await this.obtenerDatosPorRango(
      mesAtras.toISOString().split('T')[0],
      hoy.toISOString().split('T')[0]
    );
  }

  /**
   * Genera estadísticas de un período
   */
  async generarEstadisticas(fechaInicio, fechaFin) {
    try {
      const datos = await this.obtenerDatosPorRango(fechaInicio, fechaFin);
      
      if (datos.length === 0) {
        return {
          totalRegistros: 0,
          mensaje: 'No hay datos en el período seleccionado'
        };
      }

      const temperaturas = datos.map(d => d.temperatura.mascota).filter(t => t > 0);
      const sonidos = datos.map(d => d.sonido).filter(s => s >= 0);
      const diferencias = datos.map(d => d.temperatura.diferencia);

      return {
        totalRegistros: datos.length,
        periodo: {
          inicio: fechaInicio,
          fin: fechaFin
        },
        temperatura: {
          promedio: this.calcularPromedio(temperaturas),
          minima: Math.min(...temperaturas),
          maxima: Math.max(...temperaturas),
          rango: Math.max(...temperaturas) - Math.min(...temperaturas)
        },
        comportamiento: {
          promedio: this.calcularPromedio(sonidos),
          minimo: Math.min(...sonidos),
          maximo: Math.max(...sonidos)
        },
        diferenciaTermica: {
          promedio: this.calcularPromedio(diferencias),
          minima: Math.min(...diferencias),
          maxima: Math.max(...diferencias)
        },
        alertas: {
          fiebre: datos.filter(d => d.temperatura.mascota > 39.2).length,
          hipotermia: datos.filter(d => d.temperatura.mascota < 37.5).length,
          estres: datos.filter(d => d.sonido > 75).length
        },
        primerRegistro: datos[datos.length - 1]?.timestamp,
        ultimoRegistro: datos[0]?.timestamp
      };
    } catch (error) {
      console.error('❌ Error generando estadísticas:', error);
      return { error: 'Error al generar estadísticas' };
    }
  }

  /**
   * Inicia el monitoreo automático para guardar datos
   */
  iniciarMonitoreoAutomatico() {
    console.log('🔄 Iniciando monitoreo automático del collar...');
    
    const deviceRef = ref(db, this.DEVICE_PATH);
    
    return onValue(deviceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Guardar automáticamente en historial cada vez que llegan datos nuevos
        this.guardarDatosHistorial(data);
      }
    });
  }

  // ===== MÉTODOS AUXILIARES =====

  procesarTemperatura(temp) {
    return Number(temp) / 100 || 0;
  }

  interpretarEstadoSalud(datos) {
    const temp = this.procesarTemperatura(datos.temperatura?.mascota || 0);
    
    if (temp < 37.5) return 'hipotermia';
    if (temp >= 37.5 && temp <= 39.2) return 'normal';
    if (temp > 39.2 && temp <= 40.0) return 'febril';
    if (temp > 40.0) return 'fiebre_alta';
    return 'error';
  }

  interpretarComportamiento(nivel) {
    if (nivel <= 15) return 'durmiendo';
    if (nivel <= 30) return 'relajado';
    if (nivel <= 45) return 'activo';
    if (nivel <= 60) return 'comunicativo';
    if (nivel <= 75) return 'alerta';
    if (nivel <= 90) return 'estresado';
    return 'muy_alterado';
  }

  calcularPromedio(array) {
    if (array.length === 0) return 0;
    return array.reduce((sum, val) => sum + val, 0) / array.length;
  }

  /**
   * Limpia datos antiguos (opcional, para mantener la BD limpia)
   */
  async limpiarDatosAntiguos(diasAMantener = 90) {
    try {
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - diasAMantener);
      
      // Implementar lógica de limpieza si es necesario
      console.log(`🧹 Limpieza programada: mantener ${diasAMantener} días desde ${fechaLimite.toISOString()}`);
      
    } catch (error) {
      console.error('❌ Error en limpieza:', error);
    }
  }
}

// Exportar instancia singleton
export default new FirebaseHistorialService();