const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const storeReturnTo = require('../middleware/storeReturnTo')
const user = require('../controllers/users')

router.get('/register',  user.renderRegister)

router.post('/register', catchAsync( user.createUser))

router.get('/login',user.renderLogin )

router.post('/login',storeReturnTo,
     passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}),
      catchAsync(user.loginUser)
    )

router.get('/logout', user.logoutUser )

module.exports = router