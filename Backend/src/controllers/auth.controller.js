// Este es tu backend/src/controllers/auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Esta función es para el registro de la web
const registerUser = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password || password.length < 8) {
      return res.status(400).json({ message: 'Email y contraseña (mínimo 8 caracteres) son requeridos.' });
  }

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Este correo electrónico ya está en uso.' });
    }

    // OBTENEMOS EL ID DEL ROL 'VETERINARIO'
    const rolVeterinario = await pool.query("SELECT id FROM roles WHERE nombre = 'veterinario'");
    if (rolVeterinario.rows.length === 0) {
        return res.status(500).json({ message: "Configuración de roles no encontrada. Contacte al administrador." });
    }
    const rolId = rolVeterinario.rows[0].id;

    // Asumimos una clinica_id por defecto o null si no aplica. Por ejemplo, la clínica principal es ID 1.
    const clinicaIdPorDefecto = 1; 

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, rol_id, clinica_id) VALUES ($1, $2, $3, $4) RETURNING id, email, rol_id, clinica_id',
      [email, hashedPassword, rolId, clinicaIdPorDefecto] 
    );

    const newUser = result.rows[0];
    
    // El token ahora incluye el rol_id
    const token = jwt.sign({ 
        id: newUser.id, 
        email: newUser.email,
        rol_id: newUser.rol_id,
        clinica_id: newUser.clinica_id
    }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        // Devolvemos el nombre del rol para que el frontend lo pueda usar.
        rol: 'veterinario', 
        clinica_id: newUser.clinica_id
      }
    });
  } catch (err) {
    console.error('Error en el registro web:', err.message);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Esta función es para el login de la web
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // CORRECCIÓN IMPORTANTE: Ahora unimos con la tabla de roles.
    const query = `
        SELECT u.id, u.email, u.password, u.clinica_id, u.rol_id, r.nombre as rol_nombre
        FROM users u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = $1 AND r.nombre IN ('admin', 'veterinario')
    `;
    const result = await pool.query(query, [email]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado o no autorizado para acceder a la plataforma web.' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    const token = jwt.sign({ 
        id: user.id, 
        email: user.email,
        rol_id: user.rol_id,
        clinica_id: user.clinica_id
    }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol_nombre, // Enviamos el nombre del rol.
        clinica_id: user.clinica_id
      }
    });
  } catch (err) {
    console.error('Error en login web:', err.message);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = {
  registerUser,
  loginUser
};