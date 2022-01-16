var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  profilePicture: String,
  id: String,
  deleted: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("User", userSchema);