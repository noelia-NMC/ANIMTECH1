// Backend/src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado o con formato incorrecto.' });
  }
  
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // --- LÓGICA DE COMPATIBILIDAD AÑADIDA ---
    // Esta es la clave. Hacemos el middleware compatible con ambas estructuras de token.
    // Si el payload tiene un objeto 'user' anidado, lo usamos.
    // Si no, asumimos que el payload es el objeto de usuario directamente.
    if (decoded.user && decoded.user.id) {
        req.user = decoded.user;
    } else {
        req.user = decoded;
    }
    
    // Verificación de seguridad: nos aseguramos de que req.user tenga un id.
    if (!req.user || !req.user.id) {
        return res.status(403).json({ message: 'Token inválido: no contiene información de usuario.' });
    }

    console.log(`[AuthMiddleware] Token verificado para usuario ID: ${req.user.id}`);
    next();

  } catch (err) {
    console.error('[AuthMiddleware] Error de verificación de token:', err.message);
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = { verifyToken };