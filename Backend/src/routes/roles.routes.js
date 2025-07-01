const express = require('express');
const router = express.Router();
const controller = require('../controllers/roles.controller');
const { verifyToken } = require('../middlewares/auth.middleware.js');
const checkPermission = require('../middlewares/checkPermission.js');

// --- Rutas para Roles ---
router.post('/',           [verifyToken, checkPermission('roles:create')], controller.createRol);
router.get('/',            [verifyToken, checkPermission('roles:read')],   controller.getAllRoles);
router.put('/:rolId',      [verifyToken, checkPermission('roles:update')], controller.updateRol);
router.delete('/:rolId',   [verifyToken, checkPermission('roles:delete')], controller.deleteRol);

// --- Rutas para Permisos y Asignaciones ---
router.get('/permisos',    [verifyToken, checkPermission('permisos:read')],   controller.getAllPermisos);
router.put('/:rolId/permisos', [verifyToken, checkPermission('roles:update')], controller.updateRolPermisos);


module.exports = router;