const User = require('../models/user')
module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.createUser = async (req, res, next) => {
    try{
        const { username, email, password } = req.body
        const user = new User({username, email})
        const registeredUser = await User.register(user, password)
        
        //registered and user have the same exact value so either is fine
        req.login(registeredUser, err => {
            if (err) {
                return next(err)
            }
            req.flash('success', 'Welcome to YelpCamp')
            res.redirect('/campgrounds')
        })

    } catch(e) {
        console.log('Here')
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req ,res ) => {
    res.render('users/login')
}

module.exports.loginUser = async (req, res) => {
    req.flash('success', 'Welcome Back')
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
}

module.exports.logoutUser = (req, res) =>{
    req.logout(err => {
        if (err) {
            return next(err)
        }
        req.flash('success', 'Goodbye!')
        res.redirect('/campgrounds')
    })
}