// Backend/src/controllers/historial.controller.js     web 
const pool = require('../db');

const getHistorial = async (req, res) => {
  const clinicaId = req.headers['clinica-id'];
  try {
    const result = await pool.query(`
      SELECT hc.*, m.nombre AS nombre_mascota
      FROM historial_clinico hc
      JOIN mascotas m ON hc.mascota_id = m.id
      WHERE hc.clinica_id = $1
      ORDER BY hc.fecha DESC
    `, [clinicaId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createHistorial = async (req, res) => {
  const clinicaId = req.headers['clinica-id'];
  const { mascota_id, diagnostico, tratamiento, observaciones } = req.body;
  try {
    await pool.query(`
      INSERT INTO historial_clinico (mascota_id, diagnostico, tratamiento, observaciones, clinica_id)
      VALUES ($1, $2, $3, $4, $5)
    `, [mascota_id, diagnostico, tratamiento, observaciones, clinicaId]);
    res.status(201).json({ message: 'Historial registrado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateHistorial = async (req, res) => {
  const { id } = req.params;
  const { mascota_id, diagnostico, tratamiento, observaciones } = req.body;
  try {
    const result = await pool.query(`
      UPDATE historial_clinico
      SET mascota_id = $1, diagnostico = $2, tratamiento = $3, observaciones = $4
      WHERE id = $5
    `, [mascota_id, diagnostico, tratamiento, observaciones, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Historial no encontrado' });
    }

    res.json({ message: 'Historial actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteHistorial = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM historial_clinico WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Historial no encontrado' });
    }

    res.json({ message: 'Historial eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getHistorial,
  createHistorial,
  updateHistorial,
  deleteHistorial
};
