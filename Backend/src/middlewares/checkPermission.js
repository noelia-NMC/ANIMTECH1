const pool = require('../db');

/**
 * Generador de middleware para verificar permisos.
 * @param {string} permisoRequerido - El nombre del permiso necesario (ej: 'mascotas:read').
 * @returns {function} Una función middleware de Express.
 */
const checkPermission = (permisoRequerido) => {
  // Esta es la función que Express usará como middleware.
  return async (req, res, next) => {
    // Asumimos que el middleware `verifyToken` ya se ejecutó y nos dejó `req.user`.
    // req.user debería tener 'id' y 'rol_id'.
    if (!req.user || !req.user.rol_id) {
      // Si no hay usuario o no tiene rol_id después de la autenticación, algo está mal.
      return res.status(401).json({ message: 'Usuario no autenticado correctamente o rol no especificado.' });
    }

    try {
      const userRolId = req.user.rol_id;

      // Consulta a la base de datos para ver si el rol del usuario (userRolId)
      // tiene una entrada en la tabla `rol_permisos` que corresponda al `permisoRequerido`.
      const query = `
        SELECT 1 
        FROM rol_permisos rp
        JOIN permisos p ON rp.permiso_id = p.id
        WHERE rp.rol_id = $1 AND p.nombre = $2
      `;

      const result = await pool.query(query, [userRolId, permisoRequerido]);

      // Si la consulta devuelve al menos una fila (rowCount > 0), significa que el permiso existe para ese rol.
      if (result.rowCount > 0) {
        // El usuario tiene el permiso. Pasa al siguiente middleware o al controlador de la ruta.
        next(); 
      } else {
        // Si no se encontró ninguna fila, el rol del usuario no tiene el permiso.
        // Se deniega el acceso con un estado 403 Forbidden.
        return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para realizar esta acción.' });
      }
    } catch (error) {
      console.error('Error en el middleware de permisos:', error);
      // Si hay un error de base de datos o cualquier otro error inesperado.
      return res.status(500).json({ message: 'Error interno al verificar permisos.' });
    }
  };
};

module.exports = checkPermission;