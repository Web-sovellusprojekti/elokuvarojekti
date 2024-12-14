import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'testapp2',
  password: '0000',
  port: 5432,
});

export default pool;