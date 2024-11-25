import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import axios from 'axios';
import xml2js from 'xml2js';
import userRoutes from './src/routes/userRoutes.js';
import reviewRoutes from './src/routes/reviewRoutes.js';
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

// Routes
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes); 

// Set port and start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
