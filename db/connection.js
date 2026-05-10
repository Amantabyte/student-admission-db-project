const { Pool } = require('pg');
require('dotenv').config();

function getDatabaseConfig() {
  if (process.env.DATABASE_URL) {
    return { connectionString: process.env.DATABASE_URL };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'student_admission_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD
  };
}

const pool = new Pool(getDatabaseConfig());

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL client error:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  getDatabaseConfig
};
