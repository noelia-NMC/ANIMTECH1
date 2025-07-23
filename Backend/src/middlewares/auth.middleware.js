// ARCHIVO COMPLETO Y CORREGIDO: Backend/src/middlewares/auth.middleware.js

const jwt = require('jsonwebtoken');
const pool = require('../db');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado o con formato incorrecto.' });
  }
  
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.user && decoded.user.id) {
        req.user = decoded.user;
    } else {
        req.user = decoded;
    }
    
    if (!req.user || !req.user.id) {
        return res.status(403).json({ message: 'Token inválido: no contiene información de usuario.' });
    }

    console.log(`[AuthMiddleware] Token verificado para usuario ID: ${req.user.id}, Rol ID: ${req.user.rol_id}`);
    next();

  } catch (err) {
    console.error('[AuthMiddleware] Error de verificación de token:', err.message);
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

// --- FUNCIÓN AÑADIDA PARA EL MÓVIL ---
// Es un alias de verifyToken. A futuro puedes darle una lógica diferente si lo necesitas.
const verifyTokenMobile = (req, res, next) => {
  console.log('[AuthMiddleware] Verificando token para Móvil...');
  return verifyToken(req, res, next);
};

const checkPermission = (permisoRequerido) => {
  return async (req, res, next) => {
    if (!req.user || !req.user.rol_id) {
      return res.status(401).json({ message: 'Usuario no autenticado correctamente o rol no especificado.' });
    }

    try {
      const userRolId = req.user.rol_id;
      const query = `
        SELECT 1 
        FROM public.rol_permisos rp
        JOIN public.permisos p ON rp.permiso_id = p.id
        WHERE rp.rol_id = $1 AND p.nombre = $2
      `;
      const result = await pool.query(query, [userRolId, permisoRequerido]);

      if (result.rowCount > 0) {
        console.log(`[CheckPermission] Acceso concedido para rol ${userRolId} al permiso '${permisoRequerido}'.`);
        next(); 
      } else {
        console.log(`[CheckPermission] Acceso DENEGADO para rol ${userRolId} al permiso '${permisoRequerido}'.`);
        return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para realizar esta acción.' });
      }
    } catch (error) {
      console.error('Error en el middleware de permisos:', error);
      return res.status(500).json({ message: 'Error interno al verificar permisos.' });
    }
  };
};

// --- EXPORTACIÓN CORREGIDA ---
// Exportamos todas las funciones necesarias dentro de un solo objeto.
module.exports = { 
    verifyToken,
    verifyTokenMobile, // <- La nueva función ahora se exporta aquí
    checkPermission 
};