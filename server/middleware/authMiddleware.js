import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    console.log('No token provided');
    return res.sendStatus(401); }
  console.log('Token:', token);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err);
      return res.sendStatus(403);
    } 
    console.log('Decoded User:', user);
    req.user = user;
    next();
  });
};

