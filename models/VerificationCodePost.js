const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const VerificationCodePost = new Schema({
  verificationCode: Number,
});


module.exports = mongoose.model('verifCode', VerificationCodePost);