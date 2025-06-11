const pool = require('../db');

// El propietario crea una solicitud. Su ID viene del token.
exports.crearTeleconsulta = async (req, res) => {
  try {
    const propietario_id = req.user.id;
    const { mascota_id, motivo } = req.body;

    if (!mascota_id || !motivo) {
        return res.status(400).json({ message: 'Se requiere la mascota y el motivo.' });
    }
    
    // La consulta INSERT no necesita cambios, asume que las columnas son correctas.
    // El error no estaba aquí, sino en los JOINs de las otras funciones y en la lógica de la FK.
    // Asumimos que la foreign key en la tabla 'teleconsultas' apunta a 'perfiles_mascotas(id)'
    const result = await pool.query(
      `INSERT INTO teleconsultas (mascota_id, propietario_id, motivo, fecha, estado)
       VALUES ($1, $2, $3, NOW(), 'pendiente') RETURNING *`,
      [mascota_id, propietario_id, motivo]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear teleconsulta', error);
    // Si sigue fallando aquí, revisa la definición de tu tabla 'teleconsultas' en la base de datos.
    // La foreign key de `mascota_id` debe apuntar a `perfiles_mascotas(id)`.
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
       JOIN perfiles_mascotas m ON t.mascota_id = m.id -- CAMBIO AQUÍ
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
       JOIN perfiles_mascotas m ON t.mascota_id = m.id -- CAMBIO AQUÍ
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

// Aceptar y Finalizar no necesitan cambios en el JOIN, así que se quedan igual.
exports.aceptarTeleconsulta = async (req, res) => {
    try {
        const { id: consultaId } = req.params;
        const veterinario_id = req.user.id;
        const { meet_link } = req.body;

        if (!meet_link) {
            return res.status(400).json({ message: 'Se requiere el link de Meet.' });
        }

        const result = await pool.query(
            `UPDATE teleconsultas 
             SET estado = 'aceptada', veterinario_id = = $1, meet_link = $2 
             WHERE id = $3 AND estado = 'pendiente' RETURNING *`,
            [veterinario_id, meet_link, consultaId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'La consulta no se encontró o ya fue aceptada por otro veterinario.' });
        }

        res.json({ message: 'Consulta aceptada correctamente', consulta: result.rows[0] });

    } catch (error) {
        console.error('Error al aceptar teleconsulta', error);
        res.status(500).json({ message: 'Error interno al aceptar la teleconsulta.' });
    }
};

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