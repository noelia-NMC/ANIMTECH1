import API from './http'; 

export const getMisPerfiles = async () => {
    try {
        const response = await API.get('/perfiles-mascotas');
        return response.data;
    } catch (error) {
        console.error("Error en getMisPerfiles:", error.response?.data);
        throw error.response?.data || new Error('Error al obtener las mascotas');
    }
};

// Registra un nuevo perfil de mascota.
export const registrarPerfilMascota = async (datosMascota) => {
    try {
        const response = await API.post('/perfiles-mascotas', datosMascota);
        return response.data;
    } catch (error) {
        console.error("Error en registrarPerfilMascota:", error.response?.data);
        throw error.response?.data || new Error('Error al registrar la mascota');
    }
};