// Mobile/src/services/reporteCollar.js - CORREGIDO
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import HistorialService from './historialCollar';

/**
 * Genera y comparte un reporte PDF de los datos del collar
 */
export const generarYCompartirReporte = async ({ 
  mascotaId = 'device01', 
  tipo = 'completo', 
  formato = 'pdf', 
  rango,
  nombreMascota = 'Mi mascota' 
}) => {
  try {
    console.log('📄 Generando reporte:', { tipo, formato, rango });

    // Preparar las fechas
    const fechaInicio = rango.inicio.toISOString().split('T')[0];
    const fechaFin = rango.fin.toISOString().split('T')[0];

    // Obtener datos del historial
    const datosReporte = await HistorialService.prepararDatosReporte(fechaInicio, fechaFin);
    
    if (!datosReporte || datosReporte.registros.length === 0) {
      throw new Error('No hay datos disponibles para el período seleccionado');
    }

    // Generar el HTML del reporte
    const htmlContent = await generarHTMLReporte(datosReporte, tipo, nombreMascota);
    
    // Crear el PDF
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false
    });

    // Crear nombre del archivo
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `reporte_${tipo}_${nombreMascota.replace(/\s+/g, '_')}_${timestamp}.pdf`;
    const newUri = FileSystem.documentDirectory + filename;

    // Mover el archivo a la ubicación final
    await FileSystem.moveAsync({
      from: uri,
      to: newUri
    });

    // Compartir el archivo
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(newUri);
      return { 
        success: true, 
        message: `Reporte generado exitosamente.\n${datosReporte.registros.length} registros incluidos.` 
      };
    } else {
      throw new Error('Compartir no está disponible en este dispositivo.');
    }

  } catch (error) {
    console.error('❌ Error generando reporte:', error);
    throw new Error(error.message || 'Error desconocido al generar el reporte');
  }
};

/**
 * Genera el HTML para el reporte PDF
 */
const generarHTMLReporte = async (datosReporte, tipo, nombreMascota) => {
  const { registros, estadisticas, periodo } = datosReporte;
  
  // Calcular algunos datos adicionales
  const alertasTemperatura = registros.filter(r => r.temperatura.mascota < 37.5 || r.temperatura.mascota > 39.2).length;
  const alertasSonido = registros.filter(r => r.sonido > 75).length;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reporte AnimTech - ${nombreMascota}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          line-height: 1.6;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #42a8a1;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          color: #42a8a1;
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .subtitle {
          color: #666;
          font-size: 16px;
        }
        .info-section {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          background-color: #fff;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
        }
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #42a8a1;
          margin-bottom: 5px;
        }
        .stat-label {
          color: #666;
          font-size: 14px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #dee2e6;
          padding: 8px;
          text-align: left;
          font-size: 12px;
        }
        th {
          background-color: #42a8a1;
          color: white;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        .alert-high {
          background-color: #ffebee !important;
        }
        .alert-medium {
          background-color: #fff8e1 !important;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #dee2e6;
          padding-top: 20px;
        }
        .summary {
          background-color: #e8f5e8;
          border-left: 4px solid #28a745;
          padding: 15px;
          margin-bottom: 20px;
        }
        .alert-summary {
          background-color: #ffebee;
          border-left: 4px solid #dc3545;
          padding: 15px;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🐕 AnimTech</div>
        <h1>Reporte de salud - ${nombreMascota}</h1>
        <div class="subtitle">Sistema de monitoreo inteligente para mascotas</div>
      </div>

      <div class="info-section">
        <h3>📋 Información del reporte</h3>
        <p><strong>Mascota:</strong> ${nombreMascota}</p>
        <p><strong>Dispositivo:</strong> ${datosReporte.metadatos.dispositivo}</p>
        <p><strong>Período:</strong> ${periodo.inicio} al ${periodo.fin} (${periodo.totalDias} días)</p>
        <p><strong>Fecha de generación:</strong> ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</p>
        <p><strong>Total de registros:</strong> ${registros.length}</p>
      </div>

      ${estadisticas.totalRegistros > 0 ? `
        <div class="summary">
          <h3>📊 Resumen general</h3>
          <p><strong>Estado general:</strong> ${alertasTemperatura === 0 && alertasSonido === 0 ? '✅ Excelente - sin alertas detectadas' : '⚠️ Requiere atención - se detectaron algunas anomalías'}</p>
          <p><strong>Temperatura promedio:</strong> ${estadisticas.temperatura.promedio.toFixed(1)}°C (rango normal: 37.5-39.2°C)</p>
          <p><strong>Actividad promedio:</strong> ${Math.round(estadisticas.sonido.promedio)}% (nivel de sonido/comportamiento)</p>
        </div>
      ` : ''}

      ${(alertasTemperatura > 0 || alertasSonido > 0) ? `
        <div class="alert-summary">
          <h3>⚠️ Alertas detectadas</h3>
          <p><strong>Alertas de temperatura:</strong> ${alertasTemperatura} registros fuera del rango normal</p>
          <p><strong>Alertas de comportamiento:</strong> ${alertasSonido} registros con nivel de estrés alto (>75%)</p>
          <p><em>Recomendación: consultar con un veterinario si las alertas persisten.</em></p>
        </div>
      ` : ''}

      ${estadisticas.totalRegistros > 0 ? `
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${estadisticas.temperatura.promedio.toFixed(1)}°C</div>
            <div class="stat-label">Temperatura promedio</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${estadisticas.temperatura.maxima.toFixed(1)}°C</div>
            <div class="stat-label">Temperatura máxima</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${estadisticas.temperatura.minima.toFixed(1)}°C</div>
            <div class="stat-label">Temperatura mínima</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${Math.round(estadisticas.sonido.promedio)}%</div>
            <div class="stat-label">Actividad promedio</div>
          </div>
        </div>
      ` : ''}

      ${tipo === 'completo' && registros.length > 0 ? `
        <h3>📋 Detalle de registros</h3>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Temp. mascota (°C)</th>
              <th>Temp. ambiente (°C)</th>
              <th>Diferencia (°C)</th>
              <th>Sonido (%)</th>
              <th>Ubicación</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${registros.slice(0, 100).map(registro => {
              const tempAlta = registro.temperatura.mascota > 39.2;
              const tempBaja = registro.temperatura.mascota < 37.5;
              const sonidoAlto = registro.sonido > 75;
              const alerta = tempAlta || tempBaja || sonidoAlto;
              
              let claseCSS = '';
              if (tempAlta || tempBaja || sonidoAlto) claseCSS = 'alert-high';
              else if (registro.sonido > 60) claseCSS = 'alert-medium';
              
              let estado = '✅ Normal';
              if (tempAlta) estado = '🔥 Fiebre';
              else if (tempBaja) estado = '❄️ Hipotermia';
              else if (sonidoAlto) estado = '😰 Estrés alto';
              else if (registro.sonido > 60) estado = '⚠️ Alerta';
              
              return `
                <tr class="${claseCSS}">
                  <td>${registro.fecha}</td>
                  <td>${registro.hora}</td>
                  <td>${registro.temperatura.mascota.toFixed(1)}</td>
                  <td>${registro.temperatura.ambiente.toFixed(1)}</td>
                  <td>+${registro.temperatura.diferencia.toFixed(1)}</td>
                  <td>${registro.sonido}</td>
                  <td>${registro.ubicacion.latitud.toFixed(4)}, ${registro.ubicacion.longitud.toFixed(4)}</td>
                  <td>${estado}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        ${registros.length > 100 ? `<p><em>Nota: se muestran los primeros 100 de ${registros.length} registros para optimizar el reporte.</em></p>` : ''}
      ` : ''}

      <div class="footer">
        <p><strong>AnimTech - Sistema de monitoreo inteligente</strong></p>
        <p>Este reporte fue generado automáticamente por la aplicación AnimTech v${datosReporte.metadatos.version}</p>
        <p>Para más información, consulte con su veterinario de confianza</p>
        <p><em>Reporte generado el ${new Date().toLocaleDateString('es-ES')} • Total de registros analizados: ${registros.length}</em></p>
      </div>
    </body>
    </html>
  `;

  return html;
};

/**
 * Función auxiliar para validar datos antes de generar reporte
 */
export const validarDatosReporte = (rango) => {
  if (!rango || !rango.inicio || !rango.fin) {
    return { valido: false, error: 'Debe especificar un rango de fechas válido' };
  }

  if (rango.inicio > rango.fin) {
    return { valido: false, error: 'La fecha de inicio no puede ser posterior a la fecha de fin' };
  }

  const diferenciaDias = Math.ceil((rango.fin - rango.inicio) / (1000 * 60 * 60 * 24));
  if (diferenciaDias > 90) {
    return { valido: false, error: 'El rango de fechas no puede ser mayor a 90 días' };
  }

  return { valido: true };
};

/**
 * Función para obtener un reporte rápido de estadísticas
 */
export const generarReporteRapido = async (fechaInicio, fechaFin) => {
  try {
    const estadisticas = await HistorialService.obtenerEstadisticas(fechaInicio, fechaFin);
    
    if (!estadisticas || estadisticas.totalRegistros === 0) {
      return {
        success: false,
        message: 'No hay datos disponibles para el período seleccionado'
      };
    }

    return {
      success: true,
      data: {
        totalRegistros: estadisticas.totalRegistros,
        temperaturaPromedio: estadisticas.temperatura.promedio.toFixed(1),
        temperaturaMaxima: estadisticas.temperatura.maxima.toFixed(1),
        temperaturaMinima: estadisticas.temperatura.minima.toFixed(1),
        sonidoPromedio: Math.round(estadisticas.sonido.promedio),
        periodo: { inicio: fechaInicio, fin: fechaFin }
      }
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error al generar reporte rápido'
    };
  }
};