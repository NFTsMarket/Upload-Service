
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const schema = new Schema({
  file: {
    type:String,
    required:[true, "The file can not be empty"],
  },
  name: {
    type:String,
    required:[true, "The name can not be empty"]  
  },
  user: {
    type: String,
    required:[true, "The user can not be empty"]
    }
},
  {
    timestamps: true
  });

module.exports = mongoose.model('Asset', schema);
