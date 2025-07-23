// app src/controllers/perfilMascota.controller.js   //mobile
const pool = require('../db');

const getMisPerfilesMascotas = async (req, res) => {
    // Gracias al middleware robusto, esto ahora funcionará siempre.
    const propietarioId = req.user.id; 
    try {
        const result = await pool.query(
            'SELECT *, EXTRACT(YEAR FROM AGE(NOW(), fecha_nacimiento)) as edad FROM perfiles_mascotas WHERE propietario_id = $1 ORDER BY nombre ASC',
            [propietarioId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener perfiles de mascotas:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

const crearPerfilMascota = async (req, res) => {
    const propietarioId = req.user.id;
    const { nombre, especie, raza, fecha_nacimiento, genero, foto_url, notas_adicionales, collar_id } = req.body;

    if (!nombre || !especie || !fecha_nacimiento || !genero) {
        return res.status(400).json({ message: 'Nombre, especie, fecha de nacimiento y género son obligatorios.' });
    }

    let collarIdFinal = null;
    if (especie.toLowerCase() === 'canino' && collar_id) {
        collarIdFinal = collar_id;
    }
    
    try {
        const result = await pool.query(
            `INSERT INTO perfiles_mascotas 
             (nombre, especie, raza, fecha_nacimiento, genero, foto_url, notas_adicionales, propietario_id, collar_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [nombre, especie, raza, fecha_nacimiento, genero, foto_url, notas_adicionales, propietarioId, collarIdFinal]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505' && error.constraint === 'perfiles_mascotas_collar_id_key') {
            return res.status(409).json({ message: 'El ID de este collar ya está registrado por otra mascota.' });
        }
        console.error('Error al crear perfil de mascota:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

const actualizarPerfilMascota = async (req, res) => {
    const mascotaId = req.params.id;
    const propietarioId = req.user.id;
    const { nombre, especie, raza, fecha_nacimiento, genero, notas_adicionales, collar_id } = req.body;
    
    // La URL de la foto ahora vendrá de Cloudinary si se sube un nuevo archivo
    // req.file es añadido por el middleware de Multer
    let fotoUrlFinal = req.body.foto_url; // Usar la URL existente por defecto
    if (req.file) {
      fotoUrlFinal = req.file.path; // Si se sube un nuevo archivo, usamos su URL de Cloudinary
    }

    try {
        const petCheck = await pool.query(
            'SELECT foto_url FROM perfiles_mascotas WHERE id = $1 AND propietario_id = $2',
            [mascotaId, propietarioId]
        );

        if (petCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Mascota no encontrada o no tienes permiso.' });
        }
        
        // (Opcional pero recomendado) Si se sube una foto nueva, se podría borrar la anterior de Cloudinary

        const result = await pool.query(
            `UPDATE perfiles_mascotas 
             SET nombre = $1, especie = $2, raza = $3, fecha_nacimiento = $4, genero = $5, foto_url = $6, notas_adicionales = $7, collar_id = $8
             WHERE id = $9 RETURNING *`,
            [nombre, especie, raza, fecha_nacimiento, genero, fotoUrlFinal, notas_adicionales, collar_id, mascotaId]
        );

        res.json({ message: 'Perfil de mascota actualizado con éxito', mascota: result.rows[0] });
    } catch (error) {
        // ... (manejo de errores existente)
        console.error('Error al actualizar perfil de mascota:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = {
    getMisPerfilesMascotas,
    crearPerfilMascota,
    actualizarPerfilMascota,
};