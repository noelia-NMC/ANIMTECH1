// Backend/src/routes/clinicas.routes.js    para maps clinicas y refugios
const { Router } = require('express');
const router = Router();

// Importamos la nueva función del controlador
const { searchOSMClinicasAvanzado } = require('../controllers/clinica.controller');

// Opcional: Descomenta la línea de 'verifyToken' si quieres proteger la ruta
// const { verifyToken } = require('../middlewares/auth.middleware');

// Ruta final, usando el prefijo 'osm' para claridad
router.get('/osm-nearby', /* verifyToken, */ searchOSMClinicasAvanzado);

module.exports = router;