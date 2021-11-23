  
var mongoose = require('mongoose'),  
    Schema = mongoose.Schema;  

const schema = new Schema({
    file: String,
    name: String,
    user: String,
    createdAt: String,
    updatedAt: String
  });
  
module.exports = mongoose.model('Asset', schema); 
