const pool = require('../db');                     //web
const bcrypt = require('bcrypt');

const getVeterinarios = async (req, res) => {
  const clinicaId = req.headers['clinica-id'];
  if (!clinicaId) return res.status(400).json({ error: 'Falta clinica_id en headers' });

  try {
    const result = await pool.query(
      'SELECT id, nombre, especialidad, telefono, email, rol FROM veterinarios WHERE clinica_id = $1 ORDER BY nombre',
      [clinicaId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createVeterinario = async (req, res) => {
  const clinicaId = req.headers['clinica-id'];
  const { nombre, especialidad, telefono, email, password, rol } = req.body;

  if (!clinicaId) return res.status(400).json({ error: 'Falta clinica_id en headers' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO veterinarios (nombre, especialidad, telefono, email, password, rol, clinica_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [nombre, especialidad, telefono, email, hashedPassword, rol || 'veterinario', clinicaId]
    );

    res.status(201).json({ message: 'Veterinario registrado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const updateVeterinario = async (req, res) => {
  const clinicaId = req.headers['clinica-id'];
  const { id } = req.params;
  const { nombre, especialidad, telefono } = req.body;

  if (!clinicaId) return res.status(400).json({ error: 'Falta clinica_id en headers' });

  try {
    const result = await pool.query(
      `UPDATE veterinarios 
       SET nombre = $1, especialidad = $2, telefono = $3 
       WHERE id = $4 AND clinica_id = $5`,
      [nombre, especialidad, telefono, id, clinicaId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Veterinario no encontrado o no autorizado' });
    }

    res.json({ message: 'Veterinario actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteVeterinario = async (req, res) => {
  const clinicaId = req.headers['clinica-id'];
  const { id } = req.params;

  if (!clinicaId) return res.status(400).json({ error: 'Falta clinica_id en headers' });

  try {
    const result = await pool.query(
      'DELETE FROM veterinarios WHERE id = $1 AND clinica_id = $2',
      [id, clinicaId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Veterinario no encontrado o no autorizado' });
    }

    res.json({ message: 'Veterinario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getVeterinarios,
  createVeterinario,
  updateVeterinario,
  deleteVeterinario
};
