  
var mongoose = require('mongoose'),  
    Schema = mongoose.Schema;  

const schema = new Schema({
    name: String,
    lastName: String,
    userName: String,
    profilePicture: String,
    createdAt: String,
    updatedAt: String
  });
  
module.exports = mongoose.model('User', schema); 
