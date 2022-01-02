const app = require('./server.js');
const fs = require("fs");
const dbConnect = require('./db');
const dotenv = require('dotenv');
dotenv.config();
var port = (process.env.PORT || 8000);
let directory_name = "./";

let filenames = fs.readdirSync(directory_name);
  
console.log("\nFilenames in directory:");
filenames.forEach((file) => {
    console.log("File:", file);
});
console.log("Starting API server at "+port);
console.log(process.env.SECRET_KEY);

fs.readFile(".env", (err, buff) => {
    // if any error
    if (err) {
      console.error(err);
      return;
    }
  
    // otherwise log contents
    console.log(buff.toString());
  });

dbConnect().then(
    () => {
        app.listen(port);
        console.log("Server ready!");
    },
    err => {
        console.log("Connection error: "+err);
    }
) 