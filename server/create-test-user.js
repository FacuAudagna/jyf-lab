const bcrypt = require('bcryptjs');
const pool = require('./db/pool');

async function createTestUser() {
  try {
    const email = 'admin@jyflab.com';
    const password = 'admin';
    const username = 'Administrador';
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Insert user
    await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
      [username, email, hash, 'admin']
    );

    console.log('✅ Usuario de prueba creado:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creando usuario:', err);
    process.exit(1);
  }
}

createTestUser();
