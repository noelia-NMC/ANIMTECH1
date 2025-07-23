// Mobile/src/utils/dateUtils.js

/**
 * Formatea una fecha para mostrar "hace X tiempo"
 * @param {Date} date - La fecha a formatear
 * @returns {string} - Texto formateado (ej: "hace 2 horas")
 */
export const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  // Menos de 1 minuto
  if (diffInSeconds < 60) {
    return 'Ahora';
  }

  // Menos de 1 hora
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} min`;
  }

  // Menos de 1 día
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `hace ${diffInHours}h`;
  }

  // Menos de 1 semana
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `hace ${diffInDays}d`;
  }

  // Menos de 1 mes
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `hace ${diffInWeeks}sem`;
  }

  // Más de un mes - mostrar fecha completa
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Formatea una fecha para mostrar en formato legible
 * @param {Date|string} date - La fecha a formatear
 * @returns {string} - Fecha formateada (ej: "15 de Enero, 2024")
 */
export const formatReadableDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${day} de ${month}, ${year}`;
};

/**
 * Formatea una fecha y hora para mostrar en formato completo
 * @param {Date|string} date - La fecha a formatear
 * @returns {string} - Fecha y hora formateada (ej: "15/01/2024 14:30")
 */
export const formatDateTime = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Verifica si una fecha es de hoy
 * @param {Date|string} date - La fecha a verificar
 * @returns {boolean} - True si es hoy
 */
export const isToday = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return dateObj.getDate() === today.getDate() &&
         dateObj.getMonth() === today.getMonth() &&
         dateObj.getFullYear() === today.getFullYear();
};

/**
 * Verifica si una fecha es de ayer
 * @param {Date|string} date - La fecha a verificar
 * @returns {boolean} - True si es ayer
 */
export const isYesterday = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return dateObj.getDate() === yesterday.getDate() &&
         dateObj.getMonth() === yesterday.getMonth() &&
         dateObj.getFullYear() === yesterday.getFullYear();
};