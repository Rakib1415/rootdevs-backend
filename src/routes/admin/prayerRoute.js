const express = require('express');
const { body, param } = require('express-validator');
const {
   createPrayer,
   getAllPrayers,
   getPrayerById,
   updatePrayer,
   deletePrayer,
   deleteAllPrayers
} = require('../../controllers/admin/prayerController'); // Update the controller import

const router = express.Router();

// Validation middleware
const idValidation = param('id').isMongoId().withMessage('Invalid ID format');

const prayerEmailValidation = body('email')
   .isEmail()
   .withMessage('Invalid email format');

const prayerTitleValidation = body('title')
   .notEmpty()
   .withMessage('Prayer title is required');

const prayerDescriptionValidation = body('description')
   .notEmpty()
   .withMessage('Prayer description is required');

// Create Prayer Route Validation
const createPrayerValidation = [
   prayerEmailValidation,
   prayerTitleValidation,
   prayerDescriptionValidation
];

// Update Prayer Route Validation
const updatePrayerValidation = [
   idValidation,
   prayerEmailValidation,
   prayerTitleValidation,
   prayerDescriptionValidation
];

// Delete prayer Route Validation
const deletePrayerValidation = [idValidation];

// prayers route
router.get('/', getAllPrayers);
router.get('/:id', idValidation, getPrayerById);
router.post('/', createPrayerValidation, createPrayer);
router.put('/:id', updatePrayerValidation, updatePrayer);
router.delete('/:id', deletePrayerValidation, deletePrayer);
router.delete('/', deleteAllPrayers);

module.exports = router;
