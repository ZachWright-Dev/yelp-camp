const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

//Adds on a username and password
userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)