// src/models/VideoCategory.js
const mongoose = require('mongoose');

const videoCategorySchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      status: { type: String, required: true, default: '1' }
   },
   { timestamps: true }
);

const VideoCategoryModel = mongoose.model('VideoCategory', videoCategorySchema);

module.exports = VideoCategoryModel;
