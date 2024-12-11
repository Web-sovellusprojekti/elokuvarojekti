import express from 'express';
import { register, login, deleteUser } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { findUserEmail } from '../models/userModel.js';
const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.delete('/delete', authenticateToken, deleteUser);

router.get('/profile', authenticateToken, async (req, res) => {
    const user = await findUserEmail(req.user.email);
    res.json(user);
});

router.delete('/delete', authenticateToken, async (req, res) => {
    const userId = req.user.id; // extracted from the token
  
    console.log('User ID:', userId); //
  
    try {
      const result = await deleteUser(userId);
      if (!result) {
        return res.status(404).send('User not found');
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send('Failed to delete user');
    }
  });

export default router;