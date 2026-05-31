// backend/migrate.js
const pool = require('./db');

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      breed VARCHAR(255),
      location VARCHAR(255),
      imageUrl TEXT,
      phone VARCHAR(50),
      whatsapp VARCHAR(50),
      bio TEXT,
      birthday VARCHAR(50),
      weight VARCHAR(50),
      color VARCHAR(50),
      chip_id VARCHAR(50),
      vaccinations JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✅ Migration complete');
  process.exit();
}

migrate().catch(console.error);