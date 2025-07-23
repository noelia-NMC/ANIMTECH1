// Backend/src/controllers/user.controller.js              //web
const pool = require('../db');
const bcrypt = require('bcrypt');

/**
 * @description Obtiene el perfil del usuario actualmente autenticado.
 */
const getMiPerfil = async (req, res) => {
    const userId = req.user.id;
    try {
        // CONSULTA MEJORADA - Incluimos información del rol
        const query = `
            SELECT u.id, u.email, u.rol_id, u.clinica_id, u.nombre, u.apellido, u.telefono,
                   r.nombre as rol_nombre
            FROM users u
            JOIN roles r ON u.rol_id = r.id
            WHERE u.id = $1
        `;
        const result = await pool.query(query, [userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const user = result.rows[0];
        
        // RESPUESTA COMPLETA
        res.json({
            id: user.id,
            email: user.email,
            rol: user.rol_nombre,
            rol_id: user.rol_id, // CRÍTICO: Incluir rol_id
            clinica_id: user.clinica_id,
            nombre: user.nombre || '',
            apellido: user.apellido || '',
            telefono: user.telefono || ''
        });
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * @description Actualiza el perfil del usuario autenticado (nombre, email, etc.).
 */
const updateMiPerfil = async (req, res) => {
    const userId = req.user.id;
    const { email, nombre, apellido, telefono } = req.body;

    if (!email || !nombre) {
        return res.status(400).json({ message: 'El correo electrónico y el nombre son obligatorios.' });
    }

    try {
        // ACTUALIZACIÓN SIN TOCAR rol_id NI clinica_id
        const updateQuery = `
            UPDATE users
            SET email = $1, nombre = $2, apellido = $3, telefono = $4
            WHERE id = $5
            RETURNING id, email, rol_id, clinica_id, nombre, apellido, telefono
        `;
        const result = await pool.query(updateQuery, [email, nombre, apellido, telefono, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // OBTENER INFORMACIÓN COMPLETA DEL USUARIO ACTUALIZADO
        const fullUserQuery = `
            SELECT u.id, u.email, u.rol_id, u.clinica_id, u.nombre, u.apellido, u.telefono,
                   r.nombre as rol_nombre
            FROM users u
            JOIN roles r ON u.rol_id = r.id
            WHERE u.id = $1
        `;
        const fullUserResult = await pool.query(fullUserQuery, [userId]);
        const updatedUser = fullUserResult.rows[0];

        // RESPUESTA COMPLETA PRESERVANDO ROL
        res.json({ 
            message: 'Perfil actualizado con éxito', 
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                rol: updatedUser.rol_nombre,
                rol_id: updatedUser.rol_id, // CRÍTICO: Preservar rol_id
                clinica_id: updatedUser.clinica_id,
                nombre: updatedUser.nombre || '',
                apellido: updatedUser.apellido || '',
                telefono: updatedUser.telefono || ''
            }
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'El correo electrónico ya está en uso por otra cuenta.' });
        }
        console.error('Error al actualizar el perfil del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * @description Cambia la contraseña del usuario autenticado.
 */
const changeMiPassword = async (req, res) => {
    const userId = req.user.id;
    const { current_password, new_password, confirm_password } = req.body;

    if (!current_password || !new_password || !confirm_password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }
    if (new_password.length < 8) {
        return res.status(400).json({ message: "La nueva contraseña debe tener al menos 8 caracteres." });
    }
    if (new_password !== confirm_password) {
        return res.status(400).json({ message: "La nueva contraseña y la confirmación no coinciden." });
    }

    try {
        const userResult = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }
        const hashedPasswordFromDB = userResult.rows[0].password;

        const isMatch = await bcrypt.compare(current_password, hashedPasswordFromDB);
        if (!isMatch) {
            return res.status(401).json({ message: "La contraseña actual es incorrecta." });
        }

        const newHashedPassword = await bcrypt.hash(new_password, 10);
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [newHashedPassword, userId]);

        res.status(200).json({ message: "Contraseña actualizada con éxito." });

    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

module.exports = {
    getMiPerfil,
    updateMiPerfil,
    changeMiPassword
};