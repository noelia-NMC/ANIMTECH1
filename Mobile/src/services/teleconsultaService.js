// src/services/teleconsultaService.js

import API from './http';

// ===== SERVICIOS PARA PROPIETARIOS =====

// Obtener teleconsultas del propietario logueado
export const getTeleconsultasDelPropietario = () => {
  return API.get('/teleconsultas/propietario/mis-consultas');
};

// Crear nueva teleconsulta
export const crearTeleconsulta = ({ mascota_id, motivo }) => {
  return API.post('/teleconsultas', { mascota_id, motivo });
};

// Cancelar una teleconsulta (para propietarios)
export const cancelarTeleconsulta = (consultaId) => {
  return API.put(`/teleconsultas/${consultaId}/cancelar`);
};

// ===== SERVICIOS ADICIONALES =====

// Obtener una teleconsulta específica por ID
export const getTeleconsultaById = (consultaId) => {
  return API.get(`/teleconsultas/${consultaId}`);
};

// ===== SERVICIOS PARA VETERINARIOS (si se necesitan en el futuro) =====

// Obtener teleconsultas del veterinario (incluye pendientes y asignadas)
export const getTeleconsultasDelVeterinario = () => {
  return API.get('/teleconsultas/veterinario/mis-consultas');
};

// Aceptar una teleconsulta específica
export const aceptarTeleconsulta = (consultaId, data) => {
  return API.put(`/teleconsultas/${consultaId}/aceptar`, data);
};

// Finalizar una teleconsulta específica
export const finalizarTeleconsulta = (consultaId) => {
  return API.put(`/teleconsultas/${consultaId}/finalizar`);
};