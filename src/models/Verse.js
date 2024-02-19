const mongoose = require('mongoose');

const verseSchema = new mongoose.Schema(
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
      book: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Book',
         required: true
      },
      chapter: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Chapter',
         required: true
      },
      verse_text: { type: String, required: true },
      verse_id: { type: String, required: true },
      status: { type: String, default: '1' }
   },
   { timestamps: true }
);

const VerseModel = mongoose.model('Verse', verseSchema);

module.exports = VerseModel;
