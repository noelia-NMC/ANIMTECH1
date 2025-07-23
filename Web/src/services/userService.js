// src/services/userService.js
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { headers: { 'Authorization': `Bearer ${token}` } };
};

export const getProfile = () => {
  return axios.get(`${API_URL}/profile`, getAuthHeaders());
};

export const updateProfile = (profileData) => {
  return axios.put(`${API_URL}/profile`, profileData, getAuthHeaders());
};

export const changePassword = (passwordData) => {
  return axios.put(`${API_URL}/password`, passwordData, getAuthHeaders());
};

export const uploadAvatar = (formData) => {
  // Para subida de archivos, el header es diferente (multipart/form-data)
  // axios lo maneja automáticamente si le pasas un objeto FormData
  const token = localStorage.getItem('token');
  return axios.post(`${API_URL}/avatar`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};