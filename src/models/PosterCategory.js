// src/models/PosterCategory.js
const mongoose = require('mongoose');

const posterCategorySchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      status: { type: String, required: true, default: '1' }
   },
   { timestamps: true }
);

const PosterCategoryModel = mongoose.model(
   'PosterCategory',
   posterCategorySchema
);

module.exports = PosterCategoryModel;
