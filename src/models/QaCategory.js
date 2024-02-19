// src/models/QaCategory.js
const mongoose = require('mongoose');

const qaCategorySchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      status: { type: String, required: true, default: '1' }
   },
   { timestamps: true }
);

const QaCategoryModel = mongoose.model('QaCategory', qaCategorySchema);

module.exports = QaCategoryModel;
