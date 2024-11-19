const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const pool = new Pool({
    user: 'postgres',       
    database: 'elokuvaprojekti', 
    password: process.env.DB_PASSWORD,   
    port: 5432,                  
});

module.exports = pool;
