const { Schema, model } = require('mongoose');

const dictionarySchema = new Schema({
   word: {
      type: String,
      required: true
   },
   word_in_english: {
      type: String,
      required: true
   },
   defination: {
      type: String,
      required: true
   },
   tags: {
      type: [Schema.Types.ObjectId],
      ref: 'Tag',
      required: true
   },
   image: {
      type: String
   },
   caption: {
      type: String
   },
   status: {
      type: String,
      default: '1'
   },
   examples: {
      type: [Schema.Types.ObjectId],
      ref: 'Example'
   }
});

const Dictionary = model('Dictionary', dictionarySchema);

module.exports = Dictionary;
