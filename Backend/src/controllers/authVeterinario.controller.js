const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginVeterinario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM veterinarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Correo no registrado' });
    }

    const veterinario = result.rows[0];
    const passwordCorrecta = await bcrypt.compare(password, veterinario.password);

    if (!passwordCorrecta) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      {
        id: veterinario.id,
        rol: veterinario.rol,
        clinica_id: veterinario.clinica_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: veterinario.id,
        nombre: veterinario.nombre,
        email: veterinario.email,
        rol: veterinario.rol,
        clinica_id: veterinario.clinica_id,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  loginVeterinario,
};
