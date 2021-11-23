
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const schema = new Schema({
  file: String,
  name: String,
  user: String
},
  {
    timestamps: true
  });

module.exports = mongoose.model('Asset', schema);
