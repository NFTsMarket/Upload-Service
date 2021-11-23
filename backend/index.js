//Load app dependencies  
var express = require('express'),  
  mongoose = require('mongoose'),  
  http = require('http');  
var app = express();  
var bodyParser = require('body-parser');

var port=8000;
mongoose.set('bufferCommands', false);

app.use(bodyParser.json());

//Sample routes are in a separate module, just for keep the code clean  
routes = require('./routes/router')(app);  
    

const server = 'localhost:27017'; // REPLACE WITH YOUR OWN SERVER
const database = 'uploadService';          // REPLACE WITH YOUR OWN DB NAME

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb://${server}/${database}`);

        console.log('MongoDB connected!!');
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
};


app.listen(port, () => {
    connectDB();
    console.log(`Example app listening at http://localhost:${port}`)
  })