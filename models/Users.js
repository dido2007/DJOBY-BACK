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
  position: {
    latitude: { type: Number },
    longitude: { type: Number }
 }
});

module.exports = mongoose.model('Users', UsersSchema);