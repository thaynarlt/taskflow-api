const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'taskflow',
  password: process.env.DB_PASSWORD || 'taskflow',
  database: process.env.DB_NAME || 'taskflow',
});

module.exports = pool;
