const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
   {
      name: {
         type: String,
         required: true
      },
      email: {
         type: String,
         required: true,
         unique: true
      },
      password: {
         type: String,
         required: true
      },
      phone: {
         type: String
      },
      countryCode: {
         type: String
      },
      image: {
         type: String
      },
      status: {
         type: String,
         default: '1'
      },
      verifyCode: {
         type: String,
         default: null
      },
      emailVerified: {
         type: Number,
         default: 0
      },
      provider: {
         type: String
      },
      forgetCode: {
         type: String,
         default: null
      },
      otpExpires: { type: String, default: null },
      salt: {
         type: String
      },
      role: {
         type: String,
         default: 'user'
      },
      refreshToken: {
         type: String,
         required: true,
         unique: true
      }
   },
   { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
