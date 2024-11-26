import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url'; // For working with paths in ESM

import userRoutes from './src/routes/userRoutes.js'; 
import reviewRoutes from './src/routes/reviewRoutes.js'; 

// Loading environment variables from the .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(cors());  
app.use(morgan('dev')); 
app.use(express.json());  

// Routes for API
app.use('/api/users', userRoutes);  
app.use('/api/reviews', reviewRoutes);  

// Get the current file path for directory resolution
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

// Serving static files from the frontend/build folder
app.use(express.static(path.join(__dirname, '../project-frontend/build')));

// Home route to check if the server is up
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Serve frontend for all other routes (non-API requests)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../project-frontend/build', 'index.html'));
});

// Set the port and start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
