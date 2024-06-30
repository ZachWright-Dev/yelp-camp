const Campground = require('../models/campground')
const { cloudinary }= require('../cloudinary')
const mapBoxToken = process.env.MAPBOX_TOKEN
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCoder = mbxGeocoding({accessToken: mapBoxToken})


module.exports.index = async (req, res) => {
    try{
        const campgrounds = await Campground.find({})
        res.render('campgrounds/index', {campgrounds})
    } catch(e) {
        console.log(e)
    }
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
        
}

module.exports.createCampground = async (req, res, next) => {
    geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry
    campground.image = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }))
    campground.author = req.user._id;
    await campground.save()
    req.flash('success', 'Succesfully made a new campground!')
    
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path:'author'
        }
    }).populate('author')

    if (!campground){
        req.flash('error', 'That campground does not exist!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    //First check if the campground exists
    if (!campground){
        req.flash('error', 'Cannot edit campground that does not exist!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    console.log(req.body)

    //Editing the campground and saving it in database
    const  campground  = await Campground.findByIdAndUpdate(id, req.body.campground)
    const images = req.files.map(f => ({
        url : f.path,
        filename : f.filename
    }))
    //Spread all the images in 'images' into the campground.image array
    campground.image.push(...images)
    await campground.save()

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages){
            console.log(cloudinary.uploader.destroy(filename))
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull: {image: {filename: { $in: req.body.deleteImages}}}})
    }
    console.log(campground)
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
}