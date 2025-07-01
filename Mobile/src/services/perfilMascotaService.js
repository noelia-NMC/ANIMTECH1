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

export const actualizarPerfilMascota = async (mascotaId, formData) => {
    try {
        // Al enviar FormData, es crucial establecer el header correcto.
        const response = await API.put(`/perfiles-mascotas/${mascotaId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error en actualizarPerfilMascota:", error.response?.data);
        throw error.response?.data || new Error('Error al actualizar la mascota');
    }
};