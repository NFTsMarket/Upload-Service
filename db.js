const mongoose = require('mongoose');
const googlePhotos= require('./googlePhotos/googlePhotosService')

var DB_URL = ('mongodb://localhost:27017/test');

if(process.env.MONGO_HOSTNAME!=undefined){
    DB_URL = (process.env.MONGO_URL || 'mongodb://'+process.env.MONGO_HOSTNAME+':27017/test');
}

const dbConnect = function() {
    console.log(DB_URL)
    const db = mongoose.connection;
    googlePhotos.initializeGoogleCloud();
    db.on('error', console.error.bind(console, 'connection error: '));
    return mongoose.connect(DB_URL, { useNewUrlParser: true });
}

module.exports = dbConnect;