const Campground = require('../models/campground')
module.exports = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)

    if (!campground.author.equals(req.user._id)){
        req.flash('error', 'Access Denied')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
    
}