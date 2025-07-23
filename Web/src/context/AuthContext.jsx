// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al cargar la app, intenta recuperar el usuario y el token de localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        console.log('Usuario cargado desde localStorage:', parsedUser); // DEBUG
      } catch (error) {
        console.error('Error al parsear usuario desde localStorage:', error);
        // Si hay error al parsear, limpiamos localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, userToken) => {
    console.log('Login - Datos recibidos:', userData); // DEBUG
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };
  
  // FUNCIÓN MEJORADA para actualizar el usuario
  const updateUser = (updatedUserData) => {
    console.log('Actualizando usuario - Datos anteriores:', user); // DEBUG
    console.log('Actualizando usuario - Datos nuevos:', updatedUserData); // DEBUG
    
    // CRÍTICO: Preservar rol_id y otros campos importantes
    const newUser = { 
      ...user, 
      ...updatedUserData,
      // Asegurarse de que estos campos se preserven si no vienen en la actualización
      rol_id: updatedUserData.rol_id || user.rol_id,
      rol: updatedUserData.rol || user.rol,
      clinica_id: updatedUserData.clinica_id || user.clinica_id
    };
    
    console.log('Usuario final después de actualizar:', newUser); // DEBUG
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const value = {
    user,
    token,
    isLoggedIn: !!token,
    loading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};