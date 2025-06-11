const express = require('express');
const router = express.Router();
const {
  getHistorial,
  createHistorial,
  updateHistorial,
  deleteHistorial
} = require('../controllers/historial.controller');

const { verifyToken } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/', getHistorial);              
router.post('/', createHistorial);         
router.put('/:id', updateHistorial);      
router.delete('/:id', deleteHistorial); 

module.exports = router;
