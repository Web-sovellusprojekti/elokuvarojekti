
import express from 'express';
const router = express.Router();
import { authenticateToken } from '../middleware/authMiddleware.js';
import pool from '../db.js';

// Endpoint to add a favourite movie
router.post('/api/favourites', authenticateToken, async (req, res) => {
    const userId = req.user.id; // extracted from the token
    const { movieId } = req.body;
  
    // debugging
    console.log('User ID:', userId); 
    console.log('Movie ID:', movieId); 
    if (!movieId) {
        return res.status(400).send('Movie ID is required');
      }

    try {
      const result = await pool.query(
        'INSERT INTO Favourite (user_id, tmdb_id) VALUES ($1, $2) RETURNING *',
        [userId, movieId]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding to favourites:', error);
      res.status(500).send('Failed to add movie to favourites');
    }
  });
  
  // Endpoint to get favourite movies
router.get('/api/favourites', authenticateToken, async (req, res) => {
    const userId = req.user.id; // extracted from the token
  
  console.log('User ID:', userId);
    try {
      const result = await pool.query(
        'SELECT * FROM Favourite WHERE user_id = $1',
        [userId]
      );
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching favourite movies:', error);
      res.status(500).send('Failed to fetch favourite movies');
    }
  });
  
// DELETE endpoint to remove a favourite movie
router.delete('/api/favourites/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Assuming you have user authentication and can get the user ID from the request
  
    try {
      const result = await pool.query(
        'DELETE FROM Favourite WHERE tmdb_id = $1 AND user_id = $2 RETURNING *',
        [id, userId]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Favourite movie not found' });
      }
  
      res.status(200).json({ message: 'Favourite movie deleted successfully' });
    } catch (error) {
      console.error('Error deleting favourite movie:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  export default router;