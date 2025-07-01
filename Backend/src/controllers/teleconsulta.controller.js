const pool = require('../db');

// El propietario crea una solicitud. Su ID viene del token.
exports.crearTeleconsulta = async (req, res) => {
  try {
    const propietario_id = req.user.id;
    const { mascota_id, motivo } = req.body;

    if (!mascota_id || !motivo) {
        return res.status(400).json({ message: 'Se requiere la mascota y el motivo.' });
    }
    
    const result = await pool.query(
      `INSERT INTO teleconsultas (mascota_id, propietario_id, motivo, fecha, estado)
       VALUES ($1, $2, $3, NOW(), 'pendiente') RETURNING *`,
      [mascota_id, propietario_id, motivo]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear teleconsulta', error);
    res.status(500).json({ message: 'Error interno al crear la teleconsulta.' });
  }
};

// El veterinario obtiene su lista de trabajo.
exports.obtenerPorVeterinario = async (req, res) => {
  try {
    const veterinarioId = req.user.id;

    const result = await pool.query(
      `SELECT t.*, m.nombre AS nombre_mascota, u.email AS propietario_email
       FROM teleconsultas t
       JOIN perfiles_mascotas m ON t.mascota_id = m.id
       JOIN users u ON t.propietario_id = u.id
       WHERE t.veterinario_id = $1 OR t.estado = 'pendiente'
       ORDER BY t.estado = 'pendiente' DESC, t.fecha DESC`,
      [veterinarioId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener teleconsultas del veterinario', error);
    res.status(500).json({ message: 'Error interno al obtener teleconsultas.' });
  }
};

// El propietario obtiene el historial de sus solicitudes.
exports.obtenerPorPropietario = async (req, res) => {
  try {
    const propietarioId = req.user.id;

    const result = await pool.query(
      `SELECT t.*, m.nombre AS nombre_mascota
       FROM teleconsultas t
       JOIN perfiles_mascotas m ON t.mascota_id = m.id
       WHERE t.propietario_id = $1
       ORDER BY t.fecha DESC`,
      [propietarioId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener teleconsultas del propietario', error);
    res.status(500).json({ message: 'Error interno al obtener teleconsultas.' });
  }
};

// Aceptar teleconsulta
exports.aceptarTeleconsulta = async (req, res) => {
    try {
        const { id: consultaId } = req.params;
        const veterinario_id = req.user.id;
        const { meet_link } = req.body;

        if (!meet_link) {
            return res.status(400).json({ message: 'Se requiere el link de Meet.' });
        }
        
        // --- CORRECCIÓN AQUÍ ---
        // Se eliminó el '=' extra en "veterinario_id = $2".
        // También se reordenaron los parámetros para mayor claridad.
        const result = await pool.query(
            `UPDATE teleconsultas 
             SET estado = 'aceptada', meet_link = $1, veterinario_id = $2
             WHERE id = $3 AND estado = 'pendiente' RETURNING *`,
            [meet_link, veterinario_id, consultaId] // Parámetros en el orden correcto
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'La consulta no se encontró o ya fue aceptada.' });
        }

        res.json({ message: 'Consulta aceptada correctamente', consulta: result.rows[0] });

    } catch (error) {
        console.error('Error al aceptar teleconsulta:', error); // Mejor log para ver el error de la DB
        res.status(500).json({ message: 'Error interno al aceptar la teleconsulta.' });
    }
};


// Finalizar teleconsulta
exports.finalizarTeleconsulta = async (req, res) => {
  try {
    const { id: consultaId } = req.params;
    const veterinario_id = req.user.id;

    const result = await pool.query(
      `UPDATE teleconsultas SET estado = 'finalizada' WHERE id = $1 AND veterinario_id = $2 RETURNING id`,
      [consultaId, veterinario_id]
    );

    if(result.rowCount === 0) {
        return res.status(403).json({ message: 'No tienes permiso para finalizar esta consulta o no se encontró.' });
    }

    res.json({ message: 'Consulta finalizada correctamente' });
  } catch (error) {
    console.error('Error al finalizar teleconsulta', error);
    res.status(500).json({ message: 'Error interno al finalizar la teleconsulta.' });
  }
};