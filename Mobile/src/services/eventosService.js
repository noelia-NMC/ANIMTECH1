// 📁 services/eventosService.js
// (No se requieren cambios. Es genérico y funciona correctamente)

import API from './http'; // Usamos tu instancia axios con token y baseURL

// Obtener todos los eventos del usuario autenticado
export const getEventos = async () => {
  try {
    const response = await API.get('/eventos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    throw new Error('No se pudieron obtener los eventos.');
  }
};

// Crear un nuevo evento
export const createEvento = async (eventoData) => {
  try {
    const response = await API.post('/eventos', eventoData);
    return response.data;
  } catch (error) {
    console.error('Error al crear evento:', error.response?.data || error.message);
    throw new Error('No se pudo crear el evento. Verifica los datos.');
  }
};

// Eliminar un evento por ID
export const deleteEvento = async (eventoId) => {
  try {
    const response = await API.delete(`/eventos/${eventoId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    throw new Error('No se pudo eliminar el evento.');
  }
};