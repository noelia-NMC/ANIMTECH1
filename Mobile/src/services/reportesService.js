import API from './http';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const generarYCompartirReporte = async ({ mascotaId, tipo, formato, rango, nombreMascota }) => {
  try {
    const response = await API.post('/reportes', {
      mascotaId,
      tipo,
      formato,
      rango: {
        inicio: rango.inicio.toISOString(),
        fin: rango.fin.toISOString(),
      },
    }, {
      responseType: 'blob', // Importante para recibir archivos
    });

    const extension = formato === 'xlsx' ? 'xlsx' : 'pdf';
    const filename = `reporte_${tipo}_${nombreMascota.replace(/\s+/g, '_')}_${Date.now()}.${extension}`;
    const fileUri = FileSystem.documentDirectory + filename;

    const reader = new FileReader();
    reader.readAsDataURL(response.data);
    
    return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
            try {
                const base64data = reader.result.split(',')[1];
                await FileSystem.writeAsStringAsync(fileUri, base64data, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                
                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(fileUri);
                    resolve({ success: true, message: 'Reporte generado.' });
                } else {
                    reject(new Error('Compartir no está disponible en este dispositivo.'));
                }
            } catch (error) {
                console.error("Error al guardar o compartir el archivo:", error);
                reject(error);
            }
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });

  } catch (error) {
    // ===== INICIO DE LA CORRECCIÓN CLAVE =====
    // Si la respuesta es un error, Axios puede devolver los datos como un Blob.
    // Necesitamos convertir ese Blob a texto para leer el mensaje de error JSON.
    if (error.response && error.response.data instanceof Blob) {
        try {
            const errorText = await error.response.data.text();
            const errorJson = JSON.parse(errorText);
            // Re-lanzamos un error con el mensaje del backend
            throw new Error(errorJson.message || 'Ocurrió un error en el servidor.');
        } catch (parseError) {
            // Si no se puede parsear, lanzamos un error genérico.
            throw new Error('No se pudo procesar la respuesta de error del servidor.');
        }
    }
    // Si el error ya tiene un mensaje claro (ej. error de red), lo usamos.
    else if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
    }
    // Fallback para otros tipos de errores
    else {
        throw error;
    }
  }
};