const ExpressError = require('../utils/ExpressError')
const { reviewSchema } = require('../schemas')

module.exports = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message)
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}