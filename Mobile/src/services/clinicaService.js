// Mobile/src/services/clinicaService.js
import API from './http'; // Usando tu instancia de Axios

/**
 * Busca clínicas y refugios cercanos usando OSM a través de nuestro backend.
 * La consulta está optimizada para traer solo resultados con datos útiles.
 */
export const getOSMNearbyClinicas = async (lat, lng) => {
  const response = await API.get('/clinicas/osm-nearby', { params: { lat, lng } });
  return response.data;
};
