const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const isLoggedIn = require('../middleware/isLoggedIn')
const isAuthorized = require('../middleware/isAuthorized')
const validateCampground = require('../middleware/validateCampground')
const dependency = require('../controllers/campgrounds')
const multer  = require('multer')

const { storage } = require('../cloudinary')
//Telling multer to send the files to cloudinary storage instead of local storage
const upload = multer({ storage})




router.route('/')
    .get(catchAsync(dependency.index))
    // This middleware uses multer to handle file uploads. It expects an array of files with the form field name 'image'.
    .post(isLoggedIn, upload.array('image'), validateCampground,  catchAsync(dependency.createCampground)) //upload.array('image') to 


router.get('/new', isLoggedIn, dependency.renderNewForm)

router.route('/:id')
    .get(catchAsync(dependency.showCampground))
    .delete(isLoggedIn, isAuthorized, catchAsync(dependency.deleteCampground))

router.route('/:id/edit')
    .get(isLoggedIn, isAuthorized, catchAsync(dependency.renderEditForm))
    .put(isLoggedIn, isAuthorized, upload.array('image'), validateCampground,  catchAsync(dependency.updateCampground))





module.exports = router