const { Schema, model } = require('mongoose');

const tagSchema = new Schema({
   word: { type: String },
   version: {
      type: Schema.Types.ObjectId,
      ref: 'Version'
   },
   book: {
      type: Schema.Types.ObjectId,
      ref: 'Book'
   },
   chapter: {
      type: Schema.Types.ObjectId,
      ref: 'Chapter'
   },
   verse: {
      type: Schema.Types.ObjectId,
      ref: 'Verse'
   }
});

const Tag = model('Tag', tagSchema);

module.exports = Tag;
