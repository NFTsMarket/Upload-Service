const app = require('./server.js');
const dbConnect = require('./db');
const dotenv = require('dotenv');
dotenv.config();
var port = (process.env.PORT || 8000);

console.log("Starting API server at "+port);
console.log(process.env.SECRET_KEY);

dbConnect().then(
    () => {
        app.listen(port);
        console.log("Server ready!");
    },
    err => {
        console.log("Connection error: "+err);
    }
) 