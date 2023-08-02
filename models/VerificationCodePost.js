const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const VerificationCodePost = new Schema({
  verification_code: Number,
  phone_number: String,
});


module.exports = mongoose.model('verifcodes', VerificationCodePost);