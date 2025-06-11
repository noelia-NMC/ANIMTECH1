const pool = require('../db');

// ===================================================================
// FUNCIONES PARA LA APP MÓVIL (CRUD del Dueño sobre sus mascotas)
// ===================================================================

// [GET] Obtiene las mascotas del propietario que está logueado
const getMascotasPorPropietario = async (req, res) => {
  try {
    const propietarioId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM mascotas WHERE propietario_id = $1 ORDER BY nombre ASC',
      [propietarioId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener mascotas por propietario:', err.message);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// [POST] El dueño crea una nueva mascota para sí mismo
const crearMascotaDesdeMovil = async (req, res) => {
    const propietario_id = req.user.id;
    const { nombre, especie, raza, edad, genero } = req.body;
    if (!nombre || !especie) {
        return res.status(400).json({ message: 'Nombre y especie son obligatorios.' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO mascotas (nombre, especie, raza, edad, genero, propietario_id, creado_en)
             VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
            [nombre, especie, raza, edad, genero, propietario_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al crear mascota desde móvil:', err.message);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// [PUT] El dueño actualiza una de sus mascotas
const actualizarMascotaDesdeMovil = async (req, res) => {
    const propietario_id = req.user.id;
    const { id: mascota_id } = req.params;
    const { nombre, especie, raza, edad, genero } = req.body;
    try {
        const result = await pool.query(
            `UPDATE mascotas SET nombre=$1, especie=$2, raza=$3, edad=$4, genero=$5
             WHERE id = $6 AND propietario_id = $7 RETURNING *`,
            [nombre, especie, raza, edad, genero, mascota_id, propietario_id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Mascota no encontrada o no tienes permiso para editarla.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error al actualizar mascota desde móvil:', err.message);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// [DELETE] El dueño elimina una de sus mascotas
const eliminarMascotaDesdeMovil = async (req, res) => {
    const propietario_id = req.user.id;
    const { id: mascota_id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM mascotas WHERE id = $1 AND propietario_id = $2',
            [mascota_id, propietario_id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Mascota no encontrada o no tienes permiso para eliminarla.' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Error al eliminar mascota desde móvil:', err.message);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};


// ===================================================================
// FUNCIONES PARA LA PLATAFORMA WEB (Gestión de la Clínica)
// ===================================================================

// [GET] Obtiene las mascotas de una clínica específica
const getMascotas = async (req, res) => {
  const clinicaId = req.headers['clinica-id'];
  if (!clinicaId) return res.status(400).json({ error: 'Falta clinica_id en headers' });
  try {
    const result = await pool.query(
      'SELECT * FROM mascotas WHERE clinica_id = $1 ORDER BY creado_en DESC',
      [clinicaId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// [POST] Crea una mascota desde la web (asociada a una clínica y un dueño)
const createMascota = async (req, res) => {
  const { nombre, especie, raza, edad, genero, propietario_id, clinica_id } = req.body;
  if (!nombre || !propietario_id || !clinica_id) {
    return res.status(400).json({ error: 'Nombre, propietario_id y clinica_id son obligatorios.' });
  }
  try {
    await pool.query(
      'INSERT INTO mascotas (nombre, especie, raza, edad, genero, propietario_id, clinica_id, creado_en) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())',
      [nombre, especie, raza, edad, genero, propietario_id, clinica_id]
    );
    res.status(201).json({ message: 'Mascota registrada correctamente' });
  } catch (err) {
    console.error('Error al crear mascota desde web:', err.message);
    res.status(500).json({ error: err.message });
  }
};

const updateMascota = async (req, res) => {
  const { id } = req.params;
  const { nombre, especie, raza, edad, genero, propietario_id } = req.body;
  try {
    await pool.query(
      'UPDATE mascotas SET nombre=$1, especie=$2, raza=$3, edad=$4, genero=$5, propietario_id=$6 WHERE id=$7',
      [nombre, especie, raza, edad, genero, propietario_id, id]
    );
    res.json({ message: 'Mascota actualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteMascota = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM mascotas WHERE id = $1', [id]);
    res.json({ message: 'Mascota eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getMascotasPorPropietario,
  crearMascotaDesdeMovil,
  actualizarMascotaDesdeMovil,
  eliminarMascotaDesdeMovil,
  getMascotas,
  createMascota,
  updateMascota,
  deleteMascota
};