import API from './http';

export const getTeleconsultasDelPropietario = () => API.get('/teleconsultas/propietario/mis-consultas');
export const crearTeleconsulta = ({ mascota_id, motivo }) => API.post('/teleconsultas', { mascota_id, motivo });
