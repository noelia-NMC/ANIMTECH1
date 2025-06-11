// routes/veterinarios.routes.js
const express = require('express');
const router = express.Router();
const {
  getVeterinarios,
  createVeterinario,
  updateVeterinario,
  deleteVeterinario
} = require('../controllers/veterinarios.controller');

const { verifyToken } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/', getVeterinarios);
router.post('/', createVeterinario);
router.put('/:id', updateVeterinario);
router.delete('/:id', deleteVeterinario);

module.exports = router;
