import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
});

// Roles
export const getAllRoles = () => axios.get(`${API}/roles`, getAuthHeaders());
export const createRol = (rolData) => axios.post(`${API}/roles`, rolData, getAuthHeaders());
export const updateRol = (rolId, rolData) => axios.put(`${API}/roles/${rolId}`, rolData, getAuthHeaders());
export const deleteRol = (rolId) => axios.delete(`${API}/roles/${rolId}`, getAuthHeaders());

// Permisos y Asignaciones
export const getAllPermisos = () => axios.get(`${API}/roles/permisos`, getAuthHeaders());
export const updateRolPermisos = (rolId, permisosIds) => {
    return axios.put(`${API}/roles/${rolId}/permisos`, { permisosIds }, getAuthHeaders());
};