const Review = require('../models/review')
module.exports = async (req, res, next) =>{
    //Get the campground id and the review id
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)){
        req.flash('error', 'Access Denied!')
        return res.redirect(`/campgrounds/${id}/`)
    }
    next()
}