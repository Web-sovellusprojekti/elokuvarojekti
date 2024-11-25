import pkg from 'pg';  // Import the entire module as a package
const { Pool } = pkg;  // Destructure Pool from the package

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const pool = new Pool({
    user: 'postgres',       
    database: 'elokuvaprojekti', 
    password: process.env.DB_PASSWORD,   
    port: 5432,                  
});

export default pool;  // Default export of pool
