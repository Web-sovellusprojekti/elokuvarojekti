import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import favouritesRoutes from './routes/favouriteRoutes.js';
import groupRoutes from './routes/groupsRoutes.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);

// favourites routes
app.use(favouritesRoutes);

// groups routes
app.use('/api/groups', groupRoutes);

// route for root path
app.get('/', (req, res) => {
    res.send('<h1>server is running on http://localhost:3001/</h1>');
  });


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));

export default app; // export app for tests