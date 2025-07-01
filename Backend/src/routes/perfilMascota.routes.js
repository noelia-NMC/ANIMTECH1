const express = require('express');
const router = express.Router();
const perfilMascotaController = require('../controllers/perfilMascota.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// ✅ CORRECCIÓN: La ruta ahora apunta a 'middlewares' (en plural)
const upload = require('../middlewares/cloudinary');

// Todas estas rutas requieren que el usuario esté autenticado.
router.use(verifyToken);

// Obtener los perfiles de mascotas del usuario logueado
router.get('/', perfilMascotaController.getMisPerfilesMascotas);

// Crear un nuevo perfil de mascota
// NOTA: La creación de mascota también debería poder subir una foto. 
// Puedes usar upload.single('foto_file') aquí también si lo deseas.
router.post('/', perfilMascotaController.crearPerfilMascota);

// Actualizar un perfil de mascota existente.
// Esta ruta usa el middleware 'upload' para manejar la subida del archivo.
// 'foto_file' es el nombre del campo que enviamos desde el frontend.
router.put('/:id', upload.single('foto_file'), perfilMascotaController.actualizarPerfilMascota);

module.exports = router;