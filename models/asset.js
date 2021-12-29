
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const schema = new Schema({
  file: {
    type:String,
    required:[true, "The file can not be empty"],
    // match: [/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/, 'The URL is not valid']
  },
  name: {
    type:String,
    required:[true, "The file can not be empty"]  
  },
  user: {
    type: String,
    required:[true, "The file can not be empty"]
    }
},
  {
    timestamps: true
  });

module.exports = mongoose.model('Asset', schema);
