const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const verifyToken = require('../middleware/verifyToken');

// Middleware para verificar si el usuario es administrador
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
  }
  next();
};

// GET /api/users - Obtener todos los usuarios
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id_user, username, email, role, is_active, is_verified, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor al obtener usuarios' });
  }
});

// PUT /api/users/:id/role - Actualizar el rol de un usuario
router.put('/:id/role', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['admin', 'operador'].includes(role)) {
    return res.status(400).json({ error: 'Rol inválido' });
  }

  try {
    // Evitar que un admin se quite el rol a sí mismo por error
    if (parseInt(id) === req.user.userId && role !== 'admin') {
      return res.status(400).json({ error: 'No puedes quitarte el rol de administrador a ti mismo.' });
    }

    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id_user = $2 RETURNING id_user, username, role',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Rol actualizado exitosamente', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor al actualizar rol' });
  }
});

module.exports = router;
