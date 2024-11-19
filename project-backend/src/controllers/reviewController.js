const pool = require('../config/db');

// Get all reviews
async function getReviews(req, res) {
    try {
        const result = await pool.query('SELECT * FROM Review');
        res.json(result.rows); // Return list of reviews
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('Server error');
    }
}

// Add a new review
async function addReview(req, res) {
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
}

module.exports = { getReviews, addReview };
