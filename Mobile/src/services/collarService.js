import { ref, push, get, query, orderByChild, limitToLast, set, onValue } from 'firebase/database';
import { db } from '../config/firebaseConfig';

// Guardar lectura histórica en Firebase
export const saveReading = async (temperatura, sonido, ubicacion) => {
  try {
    const lectura = {
      temperatura: {
        mascota: temperatura.mascota,
        ambiente: temperatura.ambiente,
        diferencia: temperatura.mascota - temperatura.ambiente
      },
      sonido: sonido,
      ubicacion: ubicacion,
      timestamp: new Date().toLocaleString(),
      fecha: Date.now(),
    };
    
    await push(ref(db, 'historial_collar/device01'), lectura);
    return true;
  } catch (error) {
    console.error("Error guardando lectura:", error);
    return false;
  }
};

// Obtener últimas lecturas del historial
export const getLatestReadings = async (limit = 10) => {
  try {
    const q = query(
      ref(db, 'historial_collar/device01'), 
      orderByChild('fecha'), 
      limitToLast(limit)
    );
    const snap = await get(q);
    
    if (!snap.exists()) return [];

    return Object.entries(snap.val())
      .map(([id, r]) => ({ id, ...r }))
      .sort((a, b) => b.fecha - a.fecha);
  } catch (error) {
    console.error("Error al obtener lecturas:", error);
    return [];
  }
};

// Obtener estadísticas por período
export const getStatsByPeriod = async (period = 'day') => {
  try {
    const now = Date.now();
    const periodStart = {
      day: now - 86400000,
      week: now - 7 * 86400000,
      month: now - 30 * 86400000,
    }[period];

    const snap = await get(ref(db, 'historial_collar/device01'));
    if (!snap.exists()) return null;

    const lecturas = Object.values(snap.val()).filter(r => r.fecha >= periodStart);
    if (!lecturas.length) return null;

    const tempsMascota = lecturas.map(r => r.temperatura.mascota / 100);
    const tempsAmbiente = lecturas.map(r => r.temperatura.ambiente / 100);
    const sonidos = lecturas.map(r => r.sonido);
    const diferencias = lecturas.map(r => r.temperatura.diferencia / 100);

    return {
      tempMascotaAvg: parseFloat((tempsMascota.reduce((a, b) => a + b, 0) / tempsMascota.length).toFixed(1)),
      tempAmbienteAvg: parseFloat((tempsAmbiente.reduce((a, b) => a + b, 0) / tempsAmbiente.length).toFixed(1)),
      sonidoAvg: Math.round(sonidos.reduce((a, b) => a + b, 0) / sonidos.length),
      diferenciaAvg: parseFloat((diferencias.reduce((a, b) => a + b, 0) / diferencias.length).toFixed(1)),
      tempMascotaMax: Math.max(...tempsMascota),
      tempMascotaMin: Math.min(...tempsMascota),
      sonidoMax: Math.max(...sonidos),
      sonidoMin: Math.min(...sonidos),
      readingsCount: lecturas.length,
    };
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return null;
  }
};

// Verificar signos vitales (solo temperatura y sonido)
export const checkVitalSigns = (temperatura, sonido) => {
  const temp = temperatura < 37.5 ? 'danger' : 
               temperatura <= 39.2 ? 'normal' : 
               temperatura <= 40.0 ? 'warning' : 'danger';
  
  const sound = sonido > 80 ? 'danger' : 
                sonido > 60 ? 'warning' : 'normal';

  return {
    temperature: {
      status: temp,
      message: temp === 'danger' ? 
        (temperatura < 37.5 ? 'Hipotermia' : 'Hipertermia crítica') : 
        temp === 'warning' ? 'Temperatura elevada' : null
    },
    sound: {
      status: sound,
      message: sound === 'danger' ? 'Nivel de estrés crítico' : 
               sound === 'warning' ? 'Posible estrés o alerta' : null
    }
  };
};

// Crear alerta
export const createAlert = async (temperatura, sonido, ubicacion, mensaje) => {
  try {
    const alerta = {
      temperatura: temperatura,
      sonido: sonido,
      ubicacion: ubicacion,
      mensaje: mensaje,
      severity: temperatura < 37.5 || temperatura > 40.0 || sonido > 80 ? 'alta' : 'media',
      fecha: Date.now(),
      timestamp: new Date().toLocaleString(),
    };
    
    await push(ref(db, 'alertas/device01'), alerta);
    return true;
  } catch (error) {
    console.error("Error creando alerta:", error);
    return false;
  }
};

// Obtener alertas del collar
export const getCollarAlerts = async (limit = 20) => {
  try {
    const q = query(
      ref(db, 'alertas/device01'), 
      orderByChild('fecha'), 
      limitToLast(limit)
    );
    const snap = await get(q);
    
    if (!snap.exists()) return [];

    return Object.entries(snap.val())
      .map(([id, alert]) => ({ id, ...alert }))
      .sort((a, b) => b.fecha - a.fecha);
  } catch (error) {
    console.error("Error al obtener alertas:", error);
    return [];
  }
};

// Escuchar cambios en tiempo real
export const listenToCollarData = (callback) => {
  const collarRef = ref(db, 'AnimTech/device01');
  
  return onValue(collarRef, (snapshot) => {
    const data = snapshot.val();
    if (data && callback) {
      callback(data);
    }
  }, (error) => {
    console.error("Error escuchando datos:", error);
  });
};

// Simular datos del collar (para pruebas)
export const simulateCollarData = async () => {
  try {
    // Simular temperatura (multiplicar por 100 para el formato Firebase)
    const tempMascota = Math.floor((37.5 + Math.random() * 3) * 100); // 37.5-40.5°C
    const tempAmbiente = Math.floor((20 + Math.random() * 15) * 100); // 20-35°C
    
    // Simular sonido (0-100%)
    const sonido = Math.floor(Math.random() * 100);
    
    // Simular ubicación (pequeñas variaciones)
    const latitud = -17.381592 + (Math.random() - 0.5) * 0.001;
    const longitud = -66.165220 + (Math.random() - 0.5) * 0.001;
    
    const datos = {
      temperatura: {
        mascota: tempMascota,
        ambiente: tempAmbiente
      },
      sonido: sonido,
      posicion: {
        latitud: latitud,
        longitud: longitud,
        Coordenadas: `${latitud}, ${longitud}`
      }
    };

    await set(ref(db, 'AnimTech/device01'), datos);
    
    // Guardar en historial
    await saveReading(
      { mascota: tempMascota / 100, ambiente: tempAmbiente / 100 },
      sonido,
      { latitud, longitud }
    );

    // Verificar si necesita alerta
    const vitalSigns = checkVitalSigns(tempMascota / 100, sonido);
    const needsAlert = vitalSigns.temperature.status !== 'normal' || 
                       vitalSigns.sound.status !== 'normal';

    if (needsAlert) {
      const mensajes = [
        vitalSigns.temperature.message, 
        vitalSigns.sound.message
      ].filter(Boolean);
      
      await createAlert(
        tempMascota / 100, 
        sonido, 
        { latitud, longitud }, 
        mensajes.join(' y ')
      );
    }

    return { 
      temperatura: { mascota: tempMascota / 100, ambiente: tempAmbiente / 100 },
      sonido: sonido,
      ubicacion: { latitud, longitud },
      alertGenerated: needsAlert 
    };
  } catch (error) {
    console.error("Error simulando datos:", error);
    return null;
  }
};

// Obtener datos actuales del collar
export const getCurrentCollarData = async () => {
  try {
    const snap = await get(ref(db, 'AnimTech/device01'));
    if (!snap.exists()) return null;
    
    const data = snap.val();
    return {
      temperatura: {
        mascota: (data.temperatura?.mascota || 0) / 100,
        ambiente: (data.temperatura?.ambiente || 0) / 100
      },
      sonido: data.sonido || 0,
      ubicacion: {
        latitud: data.posicion?.latitud || -17.381592,
        longitud: data.posicion?.longitud || -66.165220
      }
    };
  } catch (error) {
    console.error("Error obteniendo datos actuales:", error);
    return null;
  }
};