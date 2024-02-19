// src/models/Songs.js
const mongoose = require('mongoose');

const songsSchema = new mongoose.Schema(
   {
      book_name: { type: String, required: true },
      song_title: { type: String, required: true },
      lyrics: { type: String, required: true },
      status: { type: String, default: '1' }
   },
   { timestamps: true }
);

const SongsModel = mongoose.model('Songs', songsSchema);

module.exports = SongsModel;
