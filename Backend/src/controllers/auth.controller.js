const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Usuario ya registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, rol, clinica_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, hashedPassword, 'veterinario', 1] 
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol,
        clinica_id: user.clinica_id
      }
    });
  } catch (err) {
    console.error('Error en el registro:', err.message);
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol,
        clinica_id: user.clinica_id
      }
    });
  } catch (err) {
    console.error('Error en login:', err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser
};
