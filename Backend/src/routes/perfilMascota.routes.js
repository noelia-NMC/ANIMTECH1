// src/routes/perfilMascota.routes.js
const express = require('express');
const router = express.Router();
const perfilMascotaController = require('../controllers/perfilMascota.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Todas estas rutas son para la app móvil y requieren que el usuario esté autenticado.
router.use(verifyToken);

// Obtener los perfiles de mascotas del usuario logueado
router.get('/', perfilMascotaController.getMisPerfilesMascotas);

// Crear un nuevo perfil de mascota
router.post('/', perfilMascotaController.crearPerfilMascota);

// Aquí irían las rutas PUT y DELETE
// router.put('/:id', perfilMascotaController.actualizarPerfilMascota);
// router.delete('/:id', perfilMascotaController.eliminarPerfilMascota);

module.exports = router;