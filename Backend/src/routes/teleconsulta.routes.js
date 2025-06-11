const express = require('express');
const router = express.Router();
const teleconsultaController = require('../controllers/teleconsulta.controller');
const auth = require('../middlewares/auth.middleware');

// El middleware verifyToken se encarga de poner el usuario en req.user
// El propietario crea una nueva solicitud.
router.post('/', auth.verifyToken, teleconsultaController.crearTeleconsulta);

// --- RUTAS CORREGIDAS ---

// El veterinario obtiene SUS consultas asignadas y TODAS las pendientes.
router.get('/veterinario/mis-consultas', auth.verifyToken, teleconsultaController.obtenerPorVeterinario);

// El propietario obtiene SUS consultas.
router.get('/propietario/mis-consultas', auth.verifyToken, teleconsultaController.obtenerPorPropietario); 

// --- RUTAS QUE SÍ NECESITAN ID (porque modifican un recurso específico) ---

// El veterinario acepta una consulta específica
router.put('/:id/aceptar', auth.verifyToken, teleconsultaController.aceptarTeleconsulta);

// El veterinario finaliza una consulta específica
router.put('/:id/finalizar', auth.verifyToken, teleconsultaController.finalizarTeleconsulta);


module.exports = router;