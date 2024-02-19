// src/models/Poster.js
const mongoose = require('mongoose');

const posterSchema = new mongoose.Schema(
   {
      poster_category: { type: String, required: true },
      title: { type: String, required: true },
      image: { type: String },
      description: { type: String },
      status: { type: String, default: '1' }
   },
   { timestamps: true }
);

const PosterModel = mongoose.model('Poster', posterSchema);

module.exports = PosterModel;
