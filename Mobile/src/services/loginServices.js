import API from './http';

export const loginUsuario = (email, password) =>
  API.post('/mobile/auth/login', { email, password });

export const registrarUsuario = (email, password) =>
  API.post('/mobile/auth/register', { email, password });
