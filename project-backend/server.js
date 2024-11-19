const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const userRoutes = require('./src/routes/userRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes'); 
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
