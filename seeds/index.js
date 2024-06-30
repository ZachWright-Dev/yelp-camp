//Will connect to mongoose and use model
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { descriptors, places} = require('./seedHelper')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => console.log('Database Connected'))

//Will test the data base and populate it with dummy data
const seed = async () =>{
    //Clear the campground database
    await Campground.deleteMany({})
    //Populate it
    for (let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${descriptors[Math.floor(Math.random() * descriptors.length)]} ${places[Math.floor(Math.random() * places.length)]}`,
            image: [
            {
                url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                // filename: 'YelpCamp/s6xxlodqtxp5vi6ccjzc',
            },
            {
                url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                // filename: 'YelpCamp/kybpv1bibwlm9flklb1k',
            }
        ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime consequuntur sapiente consectetur ab eos animi veniam perferendis, quia, rerum temporibus velit placeat ipsam. Ad numquam mollitia provident quidem saepe reprehenderit.',
            price: Math.floor(Math.random() * 30) + 10,
            //Making zach the owner of all the seeded campgrounds
            author: '665d2e17935997730c9a5aa4',
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            }
        })
        await camp.save()
    }
    console.log('Successfully seeded DB ')
}

seed()