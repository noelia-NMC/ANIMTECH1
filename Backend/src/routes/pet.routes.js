const express = require('express');
const router = express.Router();
const petController = require('../controllers/pet.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Aplicar el middleware de autenticación a todas las rutas de este archivo
router.use(verifyToken); 

// --- RUTAS PARA LA APP MÓVIL (gestionadas por el dueño) ---
router.get('/mis-mascotas', petController.getMascotasPorPropietario);
router.post('/mis-mascotas', petController.crearMascotaDesdeMovil);
router.put('/mis-mascotas/:id', petController.actualizarMascotaDesdeMovil);
router.delete('/mis-mascotas/:id', petController.eliminarMascotaDesdeMovil);

// --- RUTAS PARA LA PLATAFORMA WEB (gestionadas por la clínica) ---
router.get('/', petController.getMascotas);
router.post('/', petController.createMascota);
router.put('/:id', petController.updateMascota);
router.delete('/:id', petController.deleteMascota);

module.exports = router;