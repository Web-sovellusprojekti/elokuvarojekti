const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(cors());  
app.use(morgan('dev')); 
app.use(express.json());  

// Root route - test the API
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Database connection setup
const pool = new Pool({
    user: 'postgres',       
    database: 'elokuvaprojekti', 
    password: 'root',   
    port: 5432,                  
});

// Test database connection
async function testConnection() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Database connected at:', res.rows[0].now);
    } catch (err) {
        console.error('Error connecting to the database', err);
    }
}

testConnection(); // Call the function to test the database connection

// Routes
// Get all reviews
app.get('/reviews', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Review');
        res.json(result.rows); // Return list of reviews
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('Server error');
    }
});

// Add a new review
app.post('/reviews', async (req, res) => {
    const { user_id, tmdb_id, review_text, rating } = req.body;

    // Validate the rating to be between 1 and 10
    if (rating < 1 || rating > 10) {
        return res.status(400).send('Rating must be between 1 and 10');
    }

    try {
        // Check if the user exists in the Users table
        const userResult = await pool.query('SELECT * FROM Users WHERE id = $1', [user_id]);
        if (userResult.rows.length === 0) {
            return res.status(400).send('User not found');
        }

        // Insert the new review into the database
        await pool.query(
            `INSERT INTO Review (user_id, tmdb_id, review_text, rating, create_time) 
             VALUES ($1, $2, $3, $4, NOW())`,
            [user_id, tmdb_id, review_text, rating]
        );
        res.status(201).send('Review added successfully');
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).send('Server error');
    }
});

// Set port and start the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
