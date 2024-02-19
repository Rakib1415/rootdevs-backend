const express = require('express');
const { body, param } = require('express-validator');
const {
   getAllVerses,
   getVerseById,
   createVerse,
   updateVerse,
   deleteVerse,
   deleteAllVerses,
   getVerseByText
} = require('../../controllers/admin/verseController'); // Update the controller import
const VerseModel = require('../../models/Verse');

const router = express.Router();

// Validation middleware
const idValidation = param('id').isMongoId().withMessage('Invalid ID format');
const verseTextValidation = body('verse_text')
   .notEmpty()
   .withMessage('Verse text is required');
const verseIdValidation = body('verse_id')
   .notEmpty()
   .withMessage('Verse ID is required');
const statusValidation = body('status')
   .notEmpty()
   .withMessage('Status is required')
   .isIn(['0', '1'])
   .withMessage('Invalid status value');
const codeParamValidation = param('code')
   .notEmpty()
   .withMessage('Verse code parameter is required');

// Create Verse Route Validation
const createVerseValidation = [
   verseTextValidation,
   verseIdValidation,
   statusValidation
];

// Update Verse Route Validation
const updateVerseValidation = [
   idValidation,
   verseTextValidation,
   verseIdValidation,
   statusValidation
];

// Delete Verse Route Validation
const deleteVerseValidation = [idValidation];

// get verse text
router.get('/query', getVerseByText);

// verse crud route
router.get('/all', getAllVerses);
router.get('/:id', getVerseById);
router.post('/create', createVerseValidation, createVerse);
router.put('/update/:id', updateVerseValidation, updateVerse);
router.delete('/delete/:id', deleteVerseValidation, deleteVerse);
router.delete('/delete-all', deleteAllVerses);

module.exports = router;
