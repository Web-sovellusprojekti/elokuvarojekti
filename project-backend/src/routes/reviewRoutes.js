const express = require('express');
const { getReviews, addReview } = require('../controllers/reviewController');
const router = express.Router();

// Get all reviews
router.get('/reviews', getReviews);

// Add a new review
router.post('/reviews', addReview);

module.exports = router;
