// src/models/ContentManagement.js
const mongoose = require('mongoose');

const contentManagementSchema = new mongoose.Schema(
   {
      title: { type: String, required: true },
      content: { type: String, require: true },
      status: { type: String, default: '1' }
   },
   { timestamps: true }
);

const ContentManagementModel = mongoose.model(
   'ContentManagement',
   contentManagementSchema
);

module.exports = ContentManagementModel;
