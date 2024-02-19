const express = require('express');
const { body, param } = require('express-validator');
const {
   createDailyManna,
   getAllDailyManna,
   getDailyMannaById,
   updateDailyMannaById,
   deleteDailyMannaById,
   deleteAllDailyManna
} = require('../../controllers/admin/dailyMannaController'); // Update the controller import

const router = express.Router();

// Validation middleware
const idValidation = param('id').isMongoId().withMessage('Invalid ID format');

const dailyMannaTitleValidation = body('title')
   .notEmpty()
   .withMessage('Daily Manna title is required');

const dailyMannaDescriptionValidation = body('description')
   .notEmpty()
   .withMessage('Daily Manna description is required');

const dailyMannaDateValidation = body('date')
   .notEmpty()
   .withMessage('Daily Manna date is required');

// Create Daily Manna Route Validation
const createdDailyMannaValidation = [
   dailyMannaTitleValidation,
   dailyMannaDescriptionValidation,
   dailyMannaDateValidation
];

// Update daily manna Route Validation
const updateDailyMannaValidation = [
   idValidation,
   dailyMannaTitleValidation,
   dailyMannaDescriptionValidation,
   dailyMannaDateValidation
];

// Delete daily manna Route Validation
const deleteDailyMannaValidation = [idValidation];

// daily manna route
router.get('/', getAllDailyManna);
router.get('/:id', idValidation, getDailyMannaById);
router.post('/', createdDailyMannaValidation, createDailyManna);
router.put('/:id', updateDailyMannaValidation, updateDailyMannaById);
router.delete('/:id', deleteDailyMannaValidation, deleteDailyMannaById);
router.delete('/', deleteAllDailyManna);

module.exports = router;
