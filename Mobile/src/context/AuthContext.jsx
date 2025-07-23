// Mobile/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http from '../services/http';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStorageData = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('userToken');
                const storedUser = await AsyncStorage.getItem('user');
                
                if (storedToken && storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setToken(storedToken);
                    http.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                    console.log('AuthContext: Usuario cargado desde storage:', parsedUser);
                }
            } catch (e) {
                console.error("AuthContext: Error al cargar datos", e);
                // Limpiar datos corruptos
                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };
        loadStorageData();
    }, []);

    const login = async (userData, authToken) => {
        try {
            setUser(userData);
            setToken(authToken);
            http.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            await AsyncStorage.setItem('userToken', authToken);
            console.log('AuthContext: Usuario logueado:', userData);
        } catch (error) {
            console.error('AuthContext: Error al guardar datos de login:', error);
        }
    };

    const logout = async () => {
        try {
            setUser(null);
            setToken(null);
            delete http.defaults.headers.common['Authorization'];
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('userToken');
            console.log('AuthContext: Usuario deslogueado');
        } catch (error) {
            console.error('AuthContext: Error al limpiar datos de logout:', error);
        }
    };

    const updateUser = (updatedUserData) => {
        setUser(updatedUserData);
        AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
    };

    const authContextValue = {
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};