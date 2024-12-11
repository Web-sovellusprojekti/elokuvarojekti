import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserEmail, deleteUserById } from '../models/userModel.js';

export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await findUserEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(email, hashedPassword);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Request Body:', req.body); 

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  const user = await findUserEmail(email);
  console.log('Users email:', email)
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
 
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { noTimestamp:true, expiresIn: '1h' });
  
  res.json({ token });
};

export const deleteUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await deleteUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};