const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
   {
      language: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Language',
         required: true
      },
      version: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Version',
         required: true
      },
      collection_code: {
         type: String,
         enum: ['OT', 'NT', 'Both'],
         required: true
      },
      book_id: { type: String, required: true },
      book_name: { type: String, required: true, index: true },
      english_name: { type: String },
      book_order: { type: String },
      number_of_chapters: { type: String },
      chapters: { type: String },
      status: { type: String, default: '1' }
   },
   { timestamps: true }
);

const BookModel = mongoose.model('Book', bookSchema);

module.exports = BookModel;
