const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../db/pool');
const verifyToken = require('../middleware/verifyToken');
const { sendEmail } = require('../utils/email');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Check if email or username exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'El email o nombre de usuario ya está registrado' });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // 3. Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 4. Check if it's the first user to assign 'admin' role
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const role = parseInt(usersCount.rows[0].count) === 0 ? 'admin' : 'operador';

    // 5. Insert user
    await pool.query(
      `INSERT INTO users (username, email, password_hash, verification_token, is_verified, role) 
       VALUES ($1, $2, $3, $4, FALSE, $5)`,
      [username, email, hash, verificationToken, role]
    );

    // 5. Send verification email
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verifyLink = `${frontendUrl}/verify-email?token=${verificationToken}`;
    
    await sendEmail({
      to: email,
      subject: 'JYF Lab - Verifica tu cuenta',
      html: `
        <h1>Bienvenido a JYF Lab</h1>
        <p>Hola ${username}, gracias por registrarte.</p>
        <p>Por favor, verifica tu cuenta haciendo clic en el siguiente enlace:</p>
        <a href="${verifyLink}" style="display:inline-block;padding:10px 20px;background:#6366f1;color:white;text-decoration:none;border-radius:5px;">Verificar mi cuenta</a>
        <p>O copia y pega esta URL en tu navegador: <br> ${verifyLink}</p>
      `
    });

    res.status(201).json({ message: 'Usuario registrado. Por favor revisa tu email para verificar la cuenta.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/auth/verify/:token
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const result = await pool.query('SELECT id_user FROM users WHERE verification_token = $1 AND is_verified = FALSE', [token]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Token inválido o cuenta ya verificada.' });
    }

    // Update user to verified
    await pool.query('UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id_user = $1', [result.rows[0].id_user]);

    res.json({ message: 'Cuenta verificada correctamente. Ya puedes iniciar sesión.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // Verifica si la cuenta está validada
    if (!user.is_verified) {
      return res.status(403).json({ error: 'Debes verificar tu email antes de iniciar sesión.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id_user, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000
    });

    res.json({
      user: {
        id: user.id_user,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query('SELECT id_user, username FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      // Devolvemos success igual para no revelar qué emails están registrados (seguridad)
      return res.json({ message: 'Si el email está registrado, recibirás un enlace de recuperación.' });
    }

    const user = result.rows[0];
    
    // Generar token que expira en 1 hora
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora

    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id_user = $3',
      [resetToken, expires, user.id_user]
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: email,
      subject: 'JYF Lab - Recuperación de Contraseña',
      html: `
        <h2>Recuperación de contraseña</h2>
        <p>Hola ${user.username}, solicitaste restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva (es válido por 1 hora):</p>
        <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#ef4444;color:white;text-decoration:none;border-radius:5px;">Restablecer Contraseña</a>
        <p>Si no fuiste tú, puedes ignorar este correo de forma segura.</p>
      `
    });

    res.json({ message: 'Si el email está registrado, recibirás un enlace de recuperación.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const result = await pool.query(
      'SELECT id_user FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'El enlace de recuperación es inválido o ha expirado.' });
    }

    const user = result.rows[0];
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await pool.query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id_user = $2',
      [hash, user.id_user]
    );

    res.json({ message: 'Tu contraseña ha sido actualizada. Ya puedes iniciar sesión.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id_user, username, email, role FROM users WHERE id_user = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Sesión cerrada exitosamente' });
});

module.exports = router;
