import pool from '../db.js';

export const getFavouritesForUser = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT tmdb_id FROM Favourite WHERE user_id = $1`,
      [userId]
    );

    return result.rows.map(row => row.tmdb_id);
  } catch (error) {
    console.error('Error fetching favourites:', error);
    return [];
  }
};
