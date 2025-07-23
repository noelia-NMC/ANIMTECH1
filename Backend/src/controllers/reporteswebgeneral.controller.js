// ARCHIVO COMPLETO Y LISTO: Backend/src/controllers/reporteswebgeneral.controller.js

const pool = require('../db');
const PDFDocument = require('pdfkit-table');
const Excel = require('exceljs');

// --- FUNCIÓN AUXILIAR PARA OBTENER DATOS (SOLO PARA EXPORTACIÓN) ---
const getReporteCompletoData = async (clinicaId) => {
    const [
        totalMascotasRes,
        turnosEsteMesRes,
        veterinariosActivosRes,
        mascotasConsultadasRes,
        tiposConsultasRes,
        razasAtendidasRes
    ] = await Promise.all([
        pool.query('SELECT COUNT(*) as total FROM mascotas WHERE clinica_id = $1', [clinicaId]),
        pool.query('SELECT COUNT(*) as total FROM turnos WHERE EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE) AND clinica_id = $1', [clinicaId]),
        pool.query('SELECT COUNT(*) as total FROM users WHERE rol_id = (SELECT id FROM roles WHERE nombre = \'veterinario\') AND clinica_id = $1', [clinicaId]),
        pool.query('SELECT m.nombre as mascota, COALESCE(m.raza, \'Sin raza\') as raza, COUNT(t.id) as total_consultas FROM mascotas m LEFT JOIN turnos t ON m.id = t.mascota_id WHERE m.clinica_id = $1 AND t.id IS NOT NULL GROUP BY m.id ORDER BY total_consultas DESC LIMIT 10', [clinicaId]),
        pool.query('SELECT COALESCE(t.motivo, \'Sin motivo\') as motivo, COUNT(*) as cantidad FROM turnos t WHERE t.clinica_id = $1 GROUP BY t.motivo ORDER BY cantidad DESC LIMIT 10', [clinicaId]),
        pool.query('SELECT COALESCE(m.raza, \'Sin raza\') as raza, COUNT(t.id) as total_consultas FROM mascotas m LEFT JOIN turnos t ON m.id = t.mascota_id WHERE m.clinica_id = $1 AND t.id IS NOT NULL GROUP BY m.raza ORDER BY total_consultas DESC LIMIT 10', [clinicaId])
    ]);

    return {
        resumen: {
            totalMascotas: parseInt(totalMascotasRes.rows[0].total),
            turnosEsteMes: parseInt(turnosEsteMesRes.rows[0].total),
            veterinariosActivos: parseInt(veterinariosActivosRes.rows[0].total),
        },
        mascotasConsultadas: mascotasConsultadasRes.rows,
        tiposConsultas: tiposConsultasRes.rows,
        razasAtendidas: razasAtendidasRes.rows,
    };
};

// --- FUNCIONES PARA EL DASHBOARD INTERACTIVO ---

const getDashboardResumen = async (req, res) => {
    const clinicaId = req.headers['clinica-id'];
    if (!clinicaId) return res.status(400).json({ error: 'Falta clinica_id en los encabezados' });
    try {
        const totalMascotas = await pool.query('SELECT COUNT(*) as total FROM mascotas WHERE clinica_id = $1', [clinicaId]);
        const turnosEsteMes = await pool.query('SELECT COUNT(*) as total FROM turnos WHERE EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE) AND clinica_id = $1', [clinicaId]);
        const veterinariosActivos = await pool.query('SELECT COUNT(*) as total FROM users WHERE rol_id = (SELECT id FROM roles WHERE nombre = \'veterinario\') AND clinica_id = $1', [clinicaId]);
        const turnosPendientes = await pool.query('SELECT COUNT(*) as total FROM turnos WHERE fecha >= CURRENT_DATE AND clinica_id = $1', [clinicaId]);
        res.json({
            totalMascotas: parseInt(totalMascotas.rows[0].total),
            turnosEsteMes: parseInt(turnosEsteMes.rows[0].total),
            veterinariosActivos: parseInt(veterinariosActivos.rows[0].total),
            turnosPendientes: parseInt(turnosPendientes.rows[0].total)
        });
    } catch (error) {
        console.error('Error obteniendo resumen del dashboard:', error);
        res.status(500).json({ message: 'Error al obtener el resumen del dashboard' });
    }
};

const getTurnosPorPeriodo = async (req, res) => {
    const clinicaId = req.headers['clinica-id'];
    const { fechaInicio, fechaFin } = req.query;
    if (!clinicaId) return res.status(400).json({ error: 'Falta clinica_id en los encabezados' });
    if (!fechaInicio || !fechaFin) return res.status(400).json({ message: 'Se requieren fechas de inicio y fin' });
    try {
        const query = 'SELECT DATE(t.fecha) as fecha, COUNT(*) as total_turnos FROM turnos t WHERE t.fecha BETWEEN $1 AND $2 AND t.clinica_id = $3 GROUP BY DATE(t.fecha) ORDER BY fecha DESC';
        const result = await pool.query(query, [fechaInicio, fechaFin, clinicaId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo turnos por período:', error);
        res.status(500).json({ message: 'Error al obtener el reporte de turnos' });
    }
};

const getMascotasMasConsultadas = async (req, res) => {
    const clinicaId = req.headers['clinica-id'];
    if (!clinicaId) return res.status(400).json({ error: 'Falta clinica_id en los encabezados' });
    try {
        const query = 'SELECT m.nombre as mascota, COALESCE(m.raza, \'Sin raza\') as raza, COALESCE(m.edad, 0) as edad, COALESCE(m.especie, \'Sin especie\') as especie, COUNT(t.id) as total_consultas, MAX(t.fecha) as ultima_consulta FROM mascotas m LEFT JOIN turnos t ON m.id = t.mascota_id WHERE m.clinica_id = $1 GROUP BY m.id, m.nombre, m.raza, m.edad, m.especie HAVING COUNT(t.id) > 0 ORDER BY total_consultas DESC LIMIT 10';
        const result = await pool.query(query, [clinicaId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo mascotas más consultadas:', error);
        res.status(500).json({ message: 'Error al obtener el reporte de mascotas' });
    }
};

const getActividadVeterinarios = async (req, res) => {
    const clinicaId = req.headers['clinica-id'];
    const { fechaInicio, fechaFin } = req.query;
    if (!clinicaId) return res.status(400).json({ error: 'Falta clinica_id en los encabezados' });
    try {
        let query = 'SELECT COALESCE(u.nombre, \'Sin nombre\') as veterinario, COALESCE(u.email, \'Sin email\') as email, COUNT(t.id) as total_consultas, COUNT(DISTINCT t.mascota_id) as mascotas_atendidas FROM users u LEFT JOIN turnos t ON u.id = t.veterinario_id WHERE u.rol_id = (SELECT id FROM roles WHERE nombre = \'veterinario\') AND u.clinica_id = $1';
        const params = [clinicaId];
        if (fechaInicio && fechaFin) {
            query += ' AND t.fecha BETWEEN $2 AND $3';
            params.push(fechaInicio, fechaFin);
        }
        query += ' GROUP BY u.id, u.nombre, u.email ORDER BY total_consultas DESC';
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo actividad de veterinarios:', error);
        res.status(500).json({ message: 'Error al obtener el reporte de veterinarios' });
    }
};

const getTiposConsultasFrecuentes = async (req, res) => {
    const clinicaId = req.headers['clinica-id'];
    if (!clinicaId) return res.status(400).json({ error: 'Falta clinica_id en los encabezados' });
    try {
        const query = 'SELECT COALESCE(t.motivo, \'Sin motivo especificado\') as motivo, COUNT(*) as cantidad, ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM turnos WHERE clinica_id = $1), 0), 2) as porcentaje FROM turnos t WHERE t.clinica_id = $1 GROUP BY t.motivo ORDER BY cantidad DESC LIMIT 10';
        const result = await pool.query(query, [clinicaId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo tipos de consultas:', error);
        res.status(500).json({ message: 'Error al obtener los tipos de consultas' });
    }
};

const getRazasMasAtendidas = async (req, res) => {
    const clinicaId = req.headers['clinica-id'];
    if (!clinicaId) return res.status(400).json({ error: 'Falta clinica_id en los encabezados' });
    try {
        const query = 'SELECT COALESCE(m.raza, \'Sin raza especificada\') as raza, COUNT(m.id) as total_mascotas, COUNT(t.id) as total_consultas FROM mascotas m LEFT JOIN turnos t ON m.id = t.mascota_id WHERE m.clinica_id = $1 GROUP BY m.raza ORDER BY total_consultas DESC LIMIT 10';
        const result = await pool.query(query, [clinicaId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo razas más atendidas:', error);
        res.status(500).json({ message: 'Error al obtener el reporte de razas' });
    }
};

const getActividadMensual = async (req, res) => {
    const clinicaId = req.headers['clinica-id'];
    if (!clinicaId) return res.status(400).json({ error: 'Falta clinica_id en los encabezados' });
    try {
        const query = 'SELECT TO_CHAR(t.fecha, \'YYYY-MM\') as mes, COUNT(*) as total_turnos, COUNT(DISTINCT t.mascota_id) as mascotas_diferentes, COUNT(DISTINCT t.veterinario_id) as veterinarios_activos FROM turnos t WHERE t.fecha >= CURRENT_DATE - INTERVAL \'12 months\' AND t.clinica_id = $1 GROUP BY TO_CHAR(t.fecha, \'YYYY-MM\') ORDER BY mes DESC';
        const result = await pool.query(query, [clinicaId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo actividad mensual:', error);
        res.status(500).json({ message: 'Error al obtener la actividad mensual' });
    }
};


// --- FUNCIONES DE EXPORTACIÓN COMPLETAS Y CORREGIDAS ---

const exportarReportePDF = async (req, res) => {
    const clinicaId = req.headers['clinica-id'];
    if (!clinicaId) return res.status(400).json({ error: 'Falta clinica_id en los encabezados' });

    try {
        const data = await getReporteCompletoData(clinicaId);
        const doc = new PDFDocument({ margin: 30, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=reporte_clinica_${Date.now()}.pdf`);
        doc.pipe(res);

        doc.fontSize(20).text('Reporte general de la clínica', { align: 'center' });
        doc.fontSize(12).text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' });
        doc.moveDown(2);

        doc.fontSize(16).text('Resumen general', { underline: true });
        doc.moveDown();
        doc.fontSize(12).text(`- Total de mascotas registradas: ${data.resumen.totalMascotas}`);
        doc.text(`- Turnos de este mes: ${data.resumen.turnosEsteMes}`);
        doc.text(`- Veterinarios activos: ${data.resumen.veterinariosActivos}`);
        doc.moveDown(2);

        if(data.mascotasConsultadas.length > 0) {
            const mascotasTable = { title: 'Mascotas más consultadas', headers: ['Mascota', 'Raza', 'N.º de consultas'], rows: data.mascotasConsultadas.map(item => [item.mascota, item.raza, item.total_consultas]) };
            await doc.table(mascotasTable, { prepareHeader: () => doc.font('Helvetica-Bold'), width: 500 });
            doc.moveDown(2);
        }
        
        if(data.tiposConsultas.length > 0) {
            const consultasTable = { title: 'Tipos de consulta más frecuentes', headers: ['Motivo', 'Cantidad'], rows: data.tiposConsultas.map(item => [item.motivo, item.cantidad]) };
            await doc.table(consultasTable, { prepareHeader: () => doc.font('Helvetica-Bold'), width: 500 });
        }
        
        doc.end();
    } catch (error) {
        console.error('Error generando PDF:', error);
        res.status(500).json({ message: 'Error al generar el reporte en PDF' });
    }
};

const exportarReporteExcel = async (req, res) => {
    const clinicaId = req.headers['clinica-id'];
    if (!clinicaId) return res.status(400).json({ error: 'Falta clinica_id en los encabezados' });
    
    try {
        const data = await getReporteCompletoData(clinicaId);
        const workbook = new Excel.Workbook();
        workbook.creator = 'AnimTech System';
        workbook.created = new Date();

        const resumenSheet = workbook.addWorksheet('Resumen');
        resumenSheet.columns = [{ header: 'Métrica', key: 'metric', width: 30 }, { header: 'Valor', key: 'value', width: 15 }];
        resumenSheet.addRow({ metric: 'Total de mascotas registradas', value: data.resumen.totalMascotas });
        resumenSheet.addRow({ metric: 'Turnos de este mes', value: data.resumen.turnosEsteMes });
        resumenSheet.addRow({ metric: 'Veterinarios activos', value: data.resumen.veterinariosActivos });

        const mascotasSheet = workbook.addWorksheet('Mascotas consultadas');
        mascotasSheet.columns = [{ header: 'Mascota', key: 'mascota', width: 25 }, { header: 'Raza', key: 'raza', width: 25 }, { header: 'N.º de consultas', key: 'total_consultas', width: 20 }];
        mascotasSheet.addRows(data.mascotasConsultadas);

        const consultasSheet = workbook.addWorksheet('Tipos de consulta');
        consultasSheet.columns = [{ header: 'Motivo', key: 'motivo', width: 40 }, { header: 'Cantidad', key: 'cantidad', width: 15 }];
        consultasSheet.addRows(data.tiposConsultas);

        // --- HOJA AÑADIDA Y COMPLETADA ---
        const razasSheet = workbook.addWorksheet('Razas más atendidas');
        razasSheet.columns = [{ header: 'Raza', key: 'raza', width: 30 }, { header: 'N.º de consultas', key: 'total_consultas', width: 20 }];
        razasSheet.addRows(data.razasAtendidas);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=reporte_clinica_${Date.now()}.xlsx`);
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error generando Excel:', error);
        res.status(500).json({ message: 'Error al generar el reporte en Excel' });
    }
};

module.exports = {
    getDashboardResumen,
    getTurnosPorPeriodo,
    getMascotasMasConsultadas,
    getActividadVeterinarios,
    getTiposConsultasFrecuentes,
    getRazasMasAtendidas,
    getActividadMensual,
    exportarReportePDF,
    exportarReporteExcel
};