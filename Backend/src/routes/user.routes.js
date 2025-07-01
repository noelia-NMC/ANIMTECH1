// Backend/src/routes/user.routes.js   mi perfil mobile
const express = require('express');
const router = express.Router();
const { getMiPerfil, updateMiPerfil } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Definimos una ruta para obtener el perfil del usuario logueado.
// Usamos el middleware 'verifyToken' para protegerla.
// Solo los usuarios con un token válido podrán acceder.
router.get('/me', verifyToken, getMiPerfil);
router.put('/me', verifyToken, updateMiPerfil);

module.exports = router;