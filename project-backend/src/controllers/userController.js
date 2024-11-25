import pool from '../config/db.js';  // Use ES module import syntax


// Registration route
export async function registerUser(req, res) {
  const { email, password } = req.body;

  try {
      const userResult = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);

      if (userResult.rows.length > 0) {
          return res.status(400).send('A user with this email already exists');
      }

      await pool.query('INSERT INTO Users (email, password) VALUES ($1, $2)', [email, password]);

      res.status(201).send('User registered successfully');
  } catch (error) {
      console.error('Registration error:', error);
      res.status(500).send('Server error.');
  }
}

// Login route
export async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
      const userResult = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);

      if (userResult.rows.length === 0) {
          return res.status(400).send('User not found');
      }

      const user = userResult.rows[0];

      if (user.password !== password) {
          return res.status(400).send('Incorrect password');
      }

      res.status(200).send('You have successfully logged in!');
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).send('Server error.');
  }
}

// Logout route
export function logoutUser(req, res) {
  res.status(200).send('You have logged out');
}

// User deletion
export async function deleteUser(req, res) {
    const userId = req.params.id;

    try {
        // Check if user exists
        const userResult = await pool.query('SELECT * FROM Users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        // Delete user from the database
        await pool.query('DELETE FROM Users WHERE id = $1', [userId]);
        res.status(200).send('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Server error');
    }
}
