// src/models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, required: true },
      image: { type: String },
      refreshToken: { type: String, required: true, unique: true }
   },
   { timestamps: true }
);

const AdminModel = mongoose.model('Admin', adminSchema);

module.exports = AdminModel;
