const pool = require('../config/db');

// Registration route
async function registerUser(req, res) {
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
async function loginUser(req, res) {
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
function logoutUser(req, res) {
  res.status(200).send('You have logged out');
}

module.exports = { registerUser, loginUser, logoutUser };
