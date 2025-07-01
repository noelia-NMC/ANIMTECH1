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
const createVeterinario = async (req, res) => {
    // ... (la cabecera con clinicaId)
    const { nombre, especialidad, telefono, email, password, rol: rolNombre } = req.body;

    try {
        // Obtenemos el ID del rol a partir de su nombre ('admin' o 'veterinario')
        const rolRes = await pool.query("SELECT id FROM roles WHERE nombre = $1", [rolNombre]);
        if (rolRes.rows.length === 0) {
            return res.status(400).json({ message: `El rol '${rolNombre}' no es válido.` });
        }
        const rolId = rolRes.rows[0].id;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // INSERTAMOS en la tabla USERS
        await pool.query(
            `INSERT INTO users (nombre, email, password, rol_id, telefono, clinica_id)
             VALUES ($1, $2, $3, $4, $5, $6)`,
             // clinica_id aquí debe ser la del admin que lo está creando
            [nombre, email, hashedPassword, rolId, telefono, 1] 
        );

        res.status(201).json({ message: 'Usuario creado correctamente' });
    } catch (err) {
        if (err.code === '23505') { // Error de constraint unique
            return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
        }
        console.error("Error creando usuario desde panel:", err);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

module.exports = {
  loginVeterinario, createVeterinario,
};
