const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema(
   {
      language: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Language',
         required: true
      },
      version_code: { type: String, required: true, unique: true },
      english_name: { type: String, required: true },
      volume_name: { type: String, required: true, index: true },
      collection_code: {
         type: String,
         enum: ['OT', 'NT', 'Both'],
         required: true
      },
      media: {
         type: String,
         enum: ['Text', 'Audio', 'Both'],
         required: true
      },
      media_type: {
         type: String,
         enum: ['Drama', 'Non-Drama', 'N/A'],
         required: true
      },
      copyright_text: { type: String },
      copyright_link: { type: String },
      status: { type: String, default: '1' }
   },
   { timestamps: true }
);

const VersionModel = mongoose.model('Version', versionSchema);

module.exports = VersionModel;
