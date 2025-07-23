import http from './http'; 

export const sendMobileQuery = async (query, history = []) => {
    try {
        const { data } = await http.post('/chatbot-mobile/query', {
            query,
            history: JSON.stringify(history),
        });
        return data;
    } catch (error) {
        console.error("Error en el servicio de chatbot móvil:", error);
        const errorMessage = error.response?.data?.error || "Hubo un problema de conexión con AnimBot 🐾. Por favor, intenta de nuevo.";
        throw new Error(errorMessage);
    }
};