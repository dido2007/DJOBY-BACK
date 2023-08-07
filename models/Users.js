const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
  phoneNumber: String,
  fullName: String,
  age: Number,
  avatar: String, 
  userType: String,
  interestedServices: [String],
  skills: String,
  projectImages: [String],
});

module.exports = mongoose.model('Users', UsersSchema);