// src/models/songBook.js
const mongoose = require('mongoose');

const songBookSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      image: { type: String, required: true },
      status: { type: String, default: '1' }
   },
   { timestamps: true }
);

const songBookModel = mongoose.model('SongBook', songBookSchema);

module.exports = songBookModel;
