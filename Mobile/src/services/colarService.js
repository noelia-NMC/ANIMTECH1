import { ref, push, get, query, orderByChild, limitToLast, set } from 'firebase/database';
import { db } from '../config/firebaseConfig';

export const saveReading = async (temperatura, pulso) => {
  const lectura = {
    temperatura,
    pulso,
    timestamp: new Date().toLocaleString(),
    fecha: Date.now(),
  };
  await push(ref(db, 'historial_collar/collar_001'), lectura);
};

export const getLatestReadings = async (limit = 10) => {
  try {
    const q = query(ref(db, 'historial_collar/collar_001'), orderByChild('fecha'), limitToLast(limit));
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

export const getStatsByPeriod = async (period = 'day') => {
  try {
    const now = Date.now();
    const periodStart = {
      day: now - 86400000,
      week: now - 7 * 86400000,
      month: now - 30 * 86400000,
    }[period];

    const snap = await get(ref(db, 'historial_collar/collar_001'));
    if (!snap.exists()) return null;

    const lecturas = Object.values(snap.val()).filter(r => r.fecha >= periodStart);
    if (!lecturas.length) return null;

    const temps = lecturas.map(r => r.temperatura);
    const pulses = lecturas.map(r => r.pulso);

    return {
      tempAvg: parseFloat((temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)),
      pulseAvg: Math.round(pulses.reduce((a, b) => a + b, 0) / pulses.length),
      tempMax: Math.max(...temps),
      tempMin: Math.min(...temps),
      pulseMax: Math.max(...pulses),
      pulseMin: Math.min(...pulses),
      readingsCount: lecturas.length,
    };
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return null;
  }
};

export const checkVitalSigns = (temperatura, pulso) => {
  const temp = temperatura < 37.5 ? 'danger' : temperatura <= 39.2 ? 'normal' : temperatura <= 39.9 ? 'warning' : 'danger';
  const pulse = pulso < 60 ? 'danger' : pulso <= 100 ? 'normal' : pulso <= 140 ? 'warning' : 'danger';

  return {
    temperature: {
      status: temp,
      message: temp === 'danger' ? 'Temp. crítica' : temp === 'warning' ? 'Temp. elevada' : null
    },
    pulse: {
      status: pulse,
      message: pulse === 'danger' ? 'Pulso crítico' : pulse === 'warning' ? 'Pulso elevado' : null
    }
  };
};

export const createAlert = async (temperatura, pulso, mensaje) => {
  const alerta = {
    temperatura,
    pulso,
    mensaje,
    fecha: Date.now(),
    timestamp: new Date().toLocaleString(),
  };
  await push(ref(db, 'alertas/collar_001'), alerta);
};

export const simulateCollarData = async () => {
  const temperatura = parseFloat((36 + Math.random() * 6).toFixed(1));
  const pulso = Math.floor(50 + Math.random() * 120);
  const timestamp = new Date().toLocaleString();

  await set(ref(db, 'collares/collar_001'), { temperatura, pulso, timestamp });
  await saveReading(temperatura, pulso);

  const vitalSigns = checkVitalSigns(temperatura, pulso);
  const generatedAlert = vitalSigns.temperature.status !== 'normal' || vitalSigns.pulse.status !== 'normal';

  if (generatedAlert) {
    const msg = [vitalSigns.temperature.message, vitalSigns.pulse.message].filter(Boolean).join(' y ');
    await createAlert(temperatura, pulso, msg);
  }

  return { temperatura, pulso, generatedAlert };
};
