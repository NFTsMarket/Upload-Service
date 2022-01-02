const app = require('./server.js');
const dbConnect = require('./db');
const dotenv = require('dotenv');
dotenv.config();
var port = (process.env.PORT || 8000);
dbConnect().then(
    () => {
        app.listen(port);
        console.log("Server ready!");
    },
    err => {
        console.log("Connection error: "+err);
    }
) 