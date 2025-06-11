import API from './http'; 

export const getEventos = async () => {
  try {
    const response = await API.get('/eventos');
    return response.data;
  } catch (error) {
    console.error('Error en getEventos:', error.response?.data || error.message);
    throw error;
  }
};

export const addEvento = async (eventoData) => {
  try {
    const response = await API.post('/eventos', eventoData);
    return response.data;
  } catch (error) {
    console.error('Error en addEvento:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteEvento = async (eventoId) => {
  try {
    const response = await API.delete(`/eventos/${eventoId}`);
    return response.data;
  } catch (error) {
    console.error('Error en deleteEvento:', error.response?.data || error.message);
    throw error;
  }
};