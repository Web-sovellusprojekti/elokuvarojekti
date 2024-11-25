// src/routes/userRoutes.js
import express from 'express';
import { registerUser, loginUser, logoutUser, deleteUser } from '../controllers/userController.js';  // Importing controller functions
const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route for user logout
router.post('/logout', logoutUser);

// Route for user deletion
router.delete('/:id', deleteUser);

export default router;  // Default export to be imported in the server.js
