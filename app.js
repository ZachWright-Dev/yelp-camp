if (process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}
// console.log(process.env.CLOUDINARY_KEY)
// console.log(process.env.CLOUDINARY_SECRET)

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate= require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const app = express()
const session = require('express-session')
const campgroundRoutes = require('./routes/campgroundRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const userRoutes = require('./routes/users')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitze = require('express-mongo-sanitize')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => console.log('Database Connected'))

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitze())

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

//Session must be before app.use(passport.session())
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

//How to store the user in the session and how to get them out of the session
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    next()
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({email : 'zw@gmail.com', username: 'zvckool'})
    const newUser = await User.register(user, 'chicken')
    res.send(newUser)
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Error 404', 404))
})

app.use((err, req, res, next) => {
    if (!err.statusCode) err.statusCode = 500
    if (!err.message) err.message = 'Oh no, Something went wrong!'
    res.status(err.statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})