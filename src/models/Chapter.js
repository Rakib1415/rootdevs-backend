const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema(
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
      chapter_id: { type: String, required: true },
      chapter_name: { type: String, required: true, index: true },
      status: { type: String, default: '1' }
   },
   { timestamps: true }
);

const ChapterModel = mongoose.model('Chapter', chapterSchema);

module.exports = ChapterModel;
