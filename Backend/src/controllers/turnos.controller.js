const pool = require('../db');

const getTurnos = async (req, res) => {
  const clinicaId = req.headers['clinica-id'];
  if (!clinicaId) return res.status(400).json({ error: 'Falta clinica_id en headers' });

  try {
    const result = await pool.query(
      `SELECT t.*, m.nombre AS nombre_mascota, v.nombre AS nombre_veterinario
       FROM turnos t
       JOIN mascotas m ON t.mascota_id = m.id
       LEFT JOIN veterinarios v ON t.veterinario_id = v.id
       WHERE t.clinica_id = $1
       ORDER BY fecha, hora`,
      [clinicaId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTurno = async (req, res) => {
  const clinicaId = req.headers['clinica-id'];
  const { mascota_id, veterinario_id, fecha, hora, motivo } = req.body;

  if (!clinicaId) return res.status(400).json({ error: 'Falta clinica_id en headers' });

  try {
    const check = await pool.query(
      `SELECT * FROM turnos 
       WHERE veterinario_id = $1 AND fecha = $2 AND hora = $3 AND clinica_id = $4`,
      [veterinario_id, fecha, hora, clinicaId]
    );

    if (check.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe un turno para ese veterinario en ese horario.' });
    }

    await pool.query(
      `INSERT INTO turnos (mascota_id, veterinario_id, fecha, hora, motivo, clinica_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [mascota_id, veterinario_id, fecha, hora, motivo, clinicaId]
    );

    res.status(201).json({ message: 'Turno agendado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTurno = async (req, res) => {
  const clinicaId = req.headers['clinica-id'];
  const { id } = req.params;
  const { mascota_id, veterinario_id, fecha, hora, motivo } = req.body;

  if (!clinicaId) return res.status(400).json({ error: 'Falta clinica_id en headers' });

  try {
    await pool.query(
      `UPDATE turnos SET mascota_id = $1, veterinario_id = $2, fecha = $3, hora = $4, motivo = $5
       WHERE id = $6 AND clinica_id = $7`,
      [mascota_id, veterinario_id, fecha, hora, motivo, id, clinicaId]
    );
    res.json({ message: 'Turno actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTurno = async (req, res) => {
  const clinicaId = req.headers['clinica-id'];
  const { id } = req.params;

  if (!clinicaId) return res.status(400).json({ error: 'Falta clinica_id en headers' });

  try {
    await pool.query('DELETE FROM turnos WHERE id = $1 AND clinica_id = $2', [id, clinicaId]);
    res.json({ message: 'Turno eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTurnos,
  createTurno,
  updateTurno,
  deleteTurno
};
