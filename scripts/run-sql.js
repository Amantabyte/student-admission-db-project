const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const sqlFile = process.argv[2];

if (!sqlFile) {
  console.error('Usage: node scripts/run-sql.js <path-to-sql-file>');
  process.exit(1);
}

async function main() {
  const absolutePath = path.resolve(sqlFile);
  const sql = fs.readFileSync(absolutePath, 'utf8');
  const client = new Client(getDatabaseConfig());

  await client.connect();
  try {
    await client.query(sql);
    console.log(`Executed ${sqlFile}`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

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
