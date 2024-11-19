const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/userController');
const router = express.Router();

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Logout route
router.post('/logout', logoutUser);

module.exports = router;
