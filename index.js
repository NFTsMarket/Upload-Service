const app = require('./server.js');
const dbConnect = require('./db');
const dotenv = require('dotenv');
const Subscriptions = require("./models/subscriptions");

dotenv.config();
var port = (process.env.PORT || 8000);


const subscriptions = new Subscriptions();
subscriptions.initialize();
subscriptions.execute();

dbConnect().then(
    () => {
        app.listen(port);
        console.log("Server ready!");
    },
    err => {
        console.log("Connection error: "+err);
    }
) 