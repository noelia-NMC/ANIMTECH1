import API from './http';

export const getMiPerfilUsuario = async () => {
    try {
        const response = await API.get('/users/me');
        return response.data;
    } catch (error) {
        console.error("Error en getMiPerfilUsuario:", error.response?.data);
        throw error.response?.data || new Error('Error al obtener los datos del usuario');
    }
};

export const updateMiPerfilUsuario = async (datosUsuario) => {
    try {
        const response = await API.put('/users/me', datosUsuario);
        return response.data;
    } catch (error) {
        console.error("Error en updateMiPerfilUsuario:", error.response?.data);
        throw error.response?.data || new Error('Error al actualizar los datos del usuario');
    }
};