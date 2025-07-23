// src/services/notificationService.js

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const colors = {
  primary: '#42a8a1',
  success: '#48bb78',
  warning: '#ed8936',
  error: '#e53e3e'
};

// Configurar el manejador de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Configurar permisos y canales de notificación
 */
export const configurarNotificaciones = async () => {
  try {
    // Solicitar permisos
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Permisos de notificación denegados');
      return false;
    }

    // Configurar canal para Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('eventos', {
        name: 'Recordatorios de Eventos',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: colors.primary,
        sound: true,
        showBadge: true,
      });

      await Notifications.setNotificationChannelAsync('urgente', {
        name: 'Alertas Urgentes',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500],
        lightColor: colors.error,
        sound: true,
        showBadge: true,
      });
    }

    console.log('Notificaciones configuradas correctamente');
    return true;
  } catch (error) {
    console.error('Error configurando notificaciones:', error);
    return false;
  }
};

/**
 * Programar notificación para un evento
 */
export const programarNotificacionEvento = async ({
  eventoId,
  titulo,
  tipoEvento,
  mascotaNombre,
  fechaEvento,
  minutosAntes = 1440
}) => {
  try {
    const permisosOk = await configurarNotificaciones();
    if (!permisosOk) {
      throw new Error('No se pudieron configurar los permisos de notificación');
    }

    // Calcular fecha del recordatorio
    const fechaRecordatorio = new Date(fechaEvento.getTime() - (minutosAntes * 60 * 1000));
    
    // Verificar que la fecha del recordatorio no sea en el pasado
    if (fechaRecordatorio <= new Date()) {
      console.log('La fecha del recordatorio ya pasó, no se programará');
      return null;
    }

    // Configurar el contenido según el tipo de evento
    const { title, body, emoji } = generarContenidoNotificacion(titulo, tipoEvento, mascotaNombre, minutosAntes);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: { 
          eventoId: eventoId,
          tipo: tipoEvento,
          mascota: mascotaNombre,
          accion: 'recordatorio_evento'
        },
        sound: true,
        priority: Notifications.AndroidImportance.HIGH,
        badge: 1,
      },
      trigger: {
        date: fechaRecordatorio,
        channelId: Platform.OS === 'android' ? 'eventos' : undefined,
      },
    });

    console.log('Notificación programada:', {
      id: notificationId,
      fecha: fechaRecordatorio.toLocaleString('es-ES'),
      titulo: title,
      mascota: mascotaNombre,
      evento: titulo
    });

    return notificationId;
  } catch (error) {
    console.error('Error programando notificación:', error);
    throw error;
  }
};

/**
 * Generar contenido personalizado según el tipo de evento
 */
const generarContenidoNotificacion = (titulo, tipoEvento, mascotaNombre, minutosAntes) => {
  const emojis = {
    'vacuna': '💉',
    'consulta': '🩺',
    'medicamento': '💊',
    'baño': '🛁',
    'desparasitacion': '🐛',
    'otro': '📅'
  };

  const emoji = emojis[tipoEvento] || '📅';
  
  let tiempoTexto = '';
  if (minutosAntes === 0) {
    tiempoTexto = 'ahora';
  } else if (minutosAntes < 60) {
    tiempoTexto = `en ${minutosAntes} minutos`;
  } else if (minutosAntes < 1440) {
    tiempoTexto = `en ${Math.floor(minutosAntes/60)} horas`;
  } else {
    const dias = Math.floor(minutosAntes/1440);
    tiempoTexto = `en ${dias} día${dias > 1 ? 's' : ''}`;
  }

  const title = `${emoji} Recordatorio: ${titulo}`;
  const body = `${mascotaNombre} tiene ${tipoEvento} programada ${tiempoTexto}`;

  return { title, body, emoji };
};

/**
 * Programar notificación inmediata (para pruebas o alertas urgentes)
 */
export const enviarNotificacionInmediata = async (titulo, mensaje, datos = {}) => {
  try {
    const permisosOk = await configurarNotificaciones();
    if (!permisosOk) return null;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: titulo,
        body: mensaje,
        data: { ...datos, accion: 'inmediata' },
        sound: true,
        priority: Notifications.AndroidImportance.HIGH,
      },
      trigger: null, // Inmediata
    });

    return notificationId;
  } catch (error) {
    console.error('Error enviando notificación inmediata:', error);
    return null;
  }
};

/**
 * Cancelar una notificación programada
 */
export const cancelarNotificacion = async (notificationId) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('Notificación cancelada:', notificationId);
    return true;
  } catch (error) {
    console.error('Error cancelando notificación:', error);
    return false;
  }
};

/**
 * Cancelar todas las notificaciones programadas
 */
export const cancelarTodasLasNotificaciones = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Todas las notificaciones fueron canceladas');
    return true;
  } catch (error) {
    console.error('Error cancelando todas las notificaciones:', error);
    return false;
  }
};

/**
 * Obtener todas las notificaciones programadas
 */
export const obtenerNotificacionesProgramadas = async () => {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Notificaciones programadas:', notifications.length);
    return notifications;
  } catch (error) {
    console.error('Error obteniendo notificaciones programadas:', error);
    return [];
  }
};

/**
 * Configurar listeners para manejar las notificaciones cuando la app está abierta
 */
export const configurarListenersNotificaciones = (navigation) => {
  // Listener para cuando se recibe una notificación mientras la app está abierta
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notificación recibida:', notification);
    // Aquí puedes agregar lógica adicional si es necesario
  });

  // Listener para cuando el usuario toca una notificación
  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Usuario tocó la notificación:', response);
    
    const { accion, eventoId } = response.notification.request.content.data;
    
    if (accion === 'recordatorio_evento' && navigation) {
      // Navegar a la pantalla de eventos cuando se toque la notificación
      navigation.navigate('Eventos');
    }
  });

  // Función para limpiar los listeners
  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
};

/**
 * Verificar si las notificaciones están habilitadas
 */
export const verificarPermisosNotificaciones = async () => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error verificando permisos:', error);
    return false;
  }
};

export default {
  configurarNotificaciones,
  programarNotificacionEvento,
  enviarNotificacionInmediata,
  cancelarNotificacion,
  cancelarTodasLasNotificaciones,
  obtenerNotificacionesProgramadas,
  configurarListenersNotificaciones,
  verificarPermisosNotificaciones
};