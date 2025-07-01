const pool = require('../db');

// --- GESTIÓN DE ROLES ---

// [POST] Crear un nuevo rol (solo para 'admin' y 'veterinario')
exports.createRol = async (req, res) => {
    const { nombre, descripcion } = req.body;
    if (!nombre || !descripcion) {
        return res.status(400).json({ message: 'El nombre y la descripción del rol son obligatorios.' });
    }
    // Evitar crear el rol 'dueño' desde la web
    if (nombre.toLowerCase() === 'dueño') {
        return res.status(400).json({ message: 'El rol "dueño" es exclusivo de la plataforma móvil y no puede ser creado aquí.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO roles (nombre, descripcion) VALUES ($1, $2) RETURNING *',
            [nombre.toLowerCase(), descripcion]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Ya existe un rol con ese nombre.' });
        }
        res.status(500).json({ message: 'Error al crear el rol.', error: error.message });
    }
};

// [PUT] Actualizar la descripción de un rol
exports.updateRol = async (req, res) => {
    const { rolId } = req.params;
    const { descripcion } = req.body;

    try {
        const result = await pool.query(
            'UPDATE roles SET descripcion = $1 WHERE id = $2 RETURNING *',
            [descripcion, rolId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Rol no encontrado.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el rol.', error: error.message });
    }
};

// [DELETE] Eliminar un rol
exports.deleteRol = async (req, res) => {
    const { rolId } = req.params;

    try {
        const rolResult = await pool.query('SELECT nombre FROM roles WHERE id = $1', [rolId]);
        if (rolResult.rows.length > 0 && rolResult.rows[0].nombre === 'admin') {
            return res.status(403).json({ message: 'El rol de "admin" no puede ser eliminado.' });
        }
        
        // Verificar si algún usuario tiene este rol asignado
        const usersWithRole = await pool.query('SELECT COUNT(*) FROM users WHERE rol_id = $1', [rolId]);
        if (parseInt(usersWithRole.rows[0].count, 10) > 0) {
            return res.status(409).json({ message: 'No se puede eliminar el rol porque está asignado a uno o más usuarios.' });
        }

        const deleteResult = await pool.query('DELETE FROM roles WHERE id = $1', [rolId]);
        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ message: 'Rol no encontrado.' });
        }

        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el rol.', error: error.message });
    }
};


// --- GESTIÓN DE PERMISOS Y ASIGNACIONES ---

// [GET] Obtener todos los roles con sus permisos asignados
exports.getAllRoles = async (req, res) => {
    try {
        const query = `
            SELECT r.id, r.nombre, r.descripcion, 
                   COALESCE(json_agg(p.* ORDER BY p.nombre) FILTER (WHERE p.id IS NOT NULL), '[]') as permisos
            FROM roles r
            LEFT JOIN rol_permisos rp ON r.id = rp.rol_id
            LEFT JOIN permisos p ON rp.permiso_id = p.id
            WHERE r.nombre <> 'dueño' -- Excluimos el rol de la app móvil
            GROUP BY r.id, r.nombre, r.descripcion
            ORDER BY r.nombre;
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener roles', error: error.message });
    }
};

// [GET] Obtener la lista completa de todos los permisos disponibles
exports.getAllPermisos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM permisos ORDER BY nombre');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener permisos', error: error.message });
    }
};

// [PUT] Actualizar los permisos que tiene un rol específico
exports.updateRolPermisos = async (req, res) => {
    const { rolId } = req.params;
    const { permisosIds } = req.body;

    if (!Array.isArray(permisosIds)) {
        return res.status(400).json({ message: 'Se requiere un array de IDs de permisos.' });
    }
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const rolResult = await client.query('SELECT nombre FROM roles WHERE id = $1', [rolId]);
        if (rolResult.rows.length > 0 && rolResult.rows[0].nombre === 'admin') {
             await client.query('ROLLBACK');
            return res.status(403).json({ message: 'Los permisos del rol "admin" no se pueden modificar.' });
        }

        await client.query('DELETE FROM rol_permisos WHERE rol_id = $1', [rolId]);
        
        if (permisosIds.length > 0) {
            const insertQuery = 'INSERT INTO rol_permisos (rol_id, permiso_id) VALUES ' + 
                                permisosIds.map((_, i) => `($1, $${i + 2})`).join(',');
            const values = [rolId, ...permisosIds];
            await client.query(insertQuery, values);
        }

        await client.query('COMMIT');
        res.status(200).json({ message: 'Permisos del rol actualizados correctamente.' });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Error al actualizar permisos del rol', error: error.message });
    } finally {
        client.release();
    }
};