const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // pon true si usas hosting con SSL
});

module.exports = pool;
