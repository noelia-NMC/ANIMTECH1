import API from './http';

/**
 * Obtiene el historial clínico consolidado para una mascota específica.
 * @param {number} mascotaId - El ID de la mascota.
 * @returns {Promise<object>} Un objeto con el nombre de la mascota y un array con el historial.
 */
export const getHistorialClinico = async (mascotaId) => {
  try {
    const response = await API.get(`/historialMobile/mascota/${mascotaId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el historial de la mascota ${mascotaId}:`, error.response?.data || error.message);
    // Lanzar un error claro para que la UI lo pueda atrapar
    throw new Error(error.response?.data?.message || 'No se pudo cargar el historial clínico.');
  }
};