module.exports =  (req, res, next) => {
    //If user is not logged in give then an error and redirect
    if (!req.isAuthenticated()){
        //Store the original url that they were requesting
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Must be logged in!')
        return res.redirect('/login')
    }
    next()
}