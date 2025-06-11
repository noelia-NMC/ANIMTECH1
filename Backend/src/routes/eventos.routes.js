// 📁 backend/src/routes/eventos.routes.js

const express = require('express');
const router = express.Router();
const { getEventos, createEvento, deleteEvento } = require('../controllers/eventos.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);
router.get('/', getEventos);
router.post('/', createEvento);
router.delete('/:id', deleteEvento);

module.exports = router;