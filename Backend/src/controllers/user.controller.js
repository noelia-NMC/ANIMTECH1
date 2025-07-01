// Backend/src/controllers/user.controller.js
const pool = require('../db');

/**
 * @description Obtiene el perfil del usuario actualmente autenticado.
 */
const getMiPerfil = async (req, res) => {
    const userId = req.user.id;

    try {
        // ✅ CORRECCIÓN DEFINITIVA:
        // Añadimos 'nombre', 'apellido' y 'telefono' a la consulta SELECT.
        // Ahora el backend SIEMPRE enviará la información completa al frontend.
        const result = await pool.query(
            'SELECT id, email, rol, clinica_id, nombre, apellido, telefono FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * @description Actualiza el perfil del usuario autenticado.
 * (Esta función ya estaba correcta, se mantiene igual)
 */
const updateMiPerfil = async (req, res) => {
    const userId = req.user.id;
    const { email, nombre, apellido, telefono } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'El correo electrónico es obligatorio.' });
    }

    try {
        const result = await pool.query(
            `UPDATE users
             SET email = $1, nombre = $2, apellido = $3, telefono = $4
             WHERE id = $5
             RETURNING id, email, rol, clinica_id, nombre, apellido, telefono`,
            [email, nombre, apellido, telefono, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.json({ message: 'Perfil actualizado con éxito', user: result.rows[0] });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'El correo electrónico ya está en uso por otra cuenta.' });
        }
        console.error('Error al actualizar el perfil del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = {
    getMiPerfil,
    updateMiPerfil, 
};