// ARCHIVO COMPLETO Y VERIFICADO: Backend/src/routes/chatbot.routes.js

const express = require('express');
const multer = require('multer');
const { handleTextQuery, handleImageQuery } = require('../controllers/chatbot.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido.'), false);
    }
  }
});

router.post('/query-text', verifyToken, handleTextQuery);
router.post('/query-image', verifyToken, upload.single('image'), handleImageQuery);

// Asegúrate de que esta línea esté al final y sea la única exportación
module.exports = router;