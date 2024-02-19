const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema(
   {
      language_code: { type: String, required: true, unique: true },
      language_name: { type: String, required: true, index: true },
      english_name: { type: String, required: true },
      verse_text: { type: String, default: '0', enum: ['0', '1'] },
      audio: { type: String, default: '0', enum: ['0', '1'] },
      popular: { type: String, default: '0', enum: ['0', '1'] },
      status: { type: String, default: '1' }
   },
   { timestamps: true }
);

const LanguageModel = mongoose.model('Language', languageSchema);

module.exports = LanguageModel;
