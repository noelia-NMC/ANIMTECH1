const express = require('express');
const router = express.Router();
const {
  getTurnos,
  createTurno,
  updateTurno,
  deleteTurno
} = require('../controllers/turnos.controller');

const { verifyToken } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/', getTurnos);
router.post('/', createTurno);
router.put('/:id', updateTurno); 
router.delete('/:id', deleteTurno); 

module.exports = router;
