// Backend/src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const { getMiPerfil, updateMiPerfil, changeMiPassword } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// --- Rutas corregidas para coincidir con el frontend ---
// Obtener perfil del usuario logueado
// Ruta: GET /api/users/me (coincide con frontend)
router.get('/me', verifyToken, getMiPerfil);

// Actualizar perfil del usuario logueado  
// Ruta: PUT /api/users/me (coincide con frontend)
router.put('/me', verifyToken, updateMiPerfil);

// Mantener también las rutas anteriores para compatibilidad
router.get('/profile', verifyToken, getMiPerfil);
router.put('/profile', verifyToken, updateMiPerfil);

// Cambiar contraseña del usuario logueado
router.put('/password', verifyToken, changeMiPassword);

module.exports = router;