// ARCHIVO CORRECTO Y LISTO: Backend/src/routes/reporteswebgeneral.routes.js

const express = require('express');
// Esta línea ahora funcionará porque `auth.middleware.js` exporta un objeto con ambas funciones.
const { verifyToken, checkPermission } = require('../middlewares/auth.middleware');
const {
    getDashboardResumen,
    getTurnosPorPeriodo,
    getMascotasMasConsultadas,
    getActividadVeterinarios,
    getTiposConsultasFrecuentes,
    getRazasMasAtendidas,
    getActividadMensual,
    exportarReportePDF,
    exportarReporteExcel
} = require('../controllers/reporteswebgeneral.controller');

const router = express.Router();

router.use(verifyToken);

router.get('/dashboard-resumen', checkPermission('reportes:read'), getDashboardResumen);
router.get('/turnos-periodo', checkPermission('reportes:read'), getTurnosPorPeriodo);
router.get('/mascotas-consultadas', checkPermission('reportes:read'), getMascotasMasConsultadas);
router.get('/tipos-consultas', checkPermission('reportes:read'), getTiposConsultasFrecuentes);
router.get('/razas-atendidas', checkPermission('reportes:read'), getRazasMasAtendidas);
router.get('/actividad-mensual', checkPermission('reportes:read'), getActividadMensual);
router.get('/exportar-pdf', checkPermission('reportes:read'), exportarReportePDF);
router.get('/exportar-excel', checkPermission('reportes:read'), exportarReporteExcel);
router.get('/actividad-veterinarios', checkPermission('reportes:admin'), getActividadVeterinarios);

router.get('/test', (req, res) => {
    res.json({ message: `¡Reportes funcionando! Accedido por usuario ID: ${req.user.id} con rol ID: ${req.user.rol_id}` });
});

module.exports = router;