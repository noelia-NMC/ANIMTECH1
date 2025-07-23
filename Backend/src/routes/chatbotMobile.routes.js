// ARCHIVO COMPLETO Y CORREGIDO: Backend/src/routes/chatbotMobile.routes.js

const express = require('express');
const { handleMobileQuery } = require('../controllers/chatbotMobile.controller');
// La desestructuración ahora funcionará porque el middleware exporta el objeto completo
const { verifyTokenMobile } = require('../middlewares/auth.middleware'); 

const router = express.Router();

// Esta línea ya no dará error porque 'verifyTokenMobile' será una función válida
router.post('/query', verifyTokenMobile, handleMobileQuery);

module.exports = router;