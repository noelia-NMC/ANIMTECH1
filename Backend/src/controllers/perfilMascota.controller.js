// app src/controllers/perfilMascota.controller.js
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

module.exports = {
    getMisPerfilesMascotas,
    crearPerfilMascota,
};