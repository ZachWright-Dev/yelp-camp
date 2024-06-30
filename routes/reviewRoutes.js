const express = require('express')
const router = express.Router( {mergeParams: true})
const catchAsync = require('../utils/catchAsync')
const validateReview = require('../middleware/validateReview')
const isLoggedIn = require('../middleware/isLoggedIn')
const isAuthorReview = require('../middleware/isAuthorizedReview')
const review = require('../controllers/reviews')


router.post('/',isLoggedIn, validateReview, catchAsync(review.createReview))

//Have to add isAuthorReview middleware
router.delete('/:reviewId', isLoggedIn, isAuthorReview, catchAsync(review.deleteReview))

module.exports = router