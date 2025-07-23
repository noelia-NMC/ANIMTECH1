// ARCHIVO COMPLETO Y LISTO: Frontend/src/services/reportes.service.js

const getHeaders = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
        throw new Error('Usuario no autenticado o datos de sesión incompletos.');
    }

    const user = JSON.parse(userStr);
    if (!user.clinica_id) {
        throw new Error('No se encontró el ID de la clínica para el usuario.');
    }

    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'clinica-id': user.clinica_id,
    };
};

const apiFetch = async (url) => {
    const headers = getHeaders();
    const response = await fetch(url, { headers });

    if (!response.ok) {
        let errorMessage = `Error en la petición: ${response.statusText}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            console.error("La respuesta del error no fue JSON. Posible problema de ruta o proxy.");
        }
        throw new Error(errorMessage);
    }

    return response.json();
};

// --- Funciones de Servicio para el Dashboard ---
export const getDashboardResumen = () => apiFetch('/api/reporteswebgeneral/dashboard-resumen');
export const getTurnosPorPeriodo = (fechaInicio, fechaFin) => apiFetch(`/api/reporteswebgeneral/turnos-periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
export const getMascotasMasConsultadas = () => apiFetch('/api/reporteswebgeneral/mascotas-consultadas');
export const getTiposConsultasFrecuentes = () => apiFetch('/api/reporteswebgeneral/tipos-consultas');
export const getRazasMasAtendidas = () => apiFetch('/api/reporteswebgeneral/razas-atendidas');
export const getActividadVeterinarios = (fechaInicio, fechaFin) => apiFetch(`/api/reporteswebgeneral/actividad-veterinarios?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);

// --- Función de Servicio para Exportación (Maneja la descarga) ---
export const exportarReporte = async (tipo) => { // tipo es 'pdf' o 'excel'
    const headers = getHeaders();
    // No usamos apiFetch porque esperamos un blob, no un json
    const response = await fetch(`/api/reporteswebgeneral/exportar-${tipo}`, { headers });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al generar el archivo ${tipo.toUpperCase()}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    
    const extension = tipo === 'pdf' ? 'pdf' : 'xlsx';
    a.download = `reporte_clinica_${Date.now()}.${extension}`;
    
    document.body.appendChild(a);
    a.click();
    
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};