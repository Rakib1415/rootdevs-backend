// src/models/Qa.js
const mongoose = require('mongoose');

const qaSchema = new mongoose.Schema(
   {
      category: { type: String, required: true },
      question: { type: String, required: true },
      answer: { type: String, required: true },
      status: { type: String, default: '1' }
   },
   { timestamps: true }
);

const QaModel = mongoose.model('Qa', qaSchema);

module.exports = QaModel;
