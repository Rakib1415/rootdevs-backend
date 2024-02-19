const express = require('express');
const { body, param } = require('express-validator');
const {
   getAllChapters,
   getChapterById,
   createChapter,
   updateChapter,
   deleteChapter,
   deleteAllChapters
} = require('../../controllers/admin/chapterController'); // Update the controller import
const ChapterModel = require('../../models/Chapter');

const router = express.Router();

// Validation middleware
const idValidation = param('id').isMongoId().withMessage('Invalid ID format');
const chapterIdValidation = body('chapter_id')
   .notEmpty()
   .withMessage('Chapter ID is required');
const chapterNameValidation = body('chapter_name')
   .notEmpty()
   .withMessage('Chapter name is required');
const statusValidation = body('status')
   .notEmpty()
   .withMessage('Status is required')
   .isIn(['0', '1'])
   .withMessage('Invalid status value');

// Create Chapter Route Validation
const createChapterValidation = [
   chapterIdValidation,
   chapterNameValidation,
   statusValidation
];

// Update Chapter Route Validation
const updateChapterValidation = [
   idValidation,
   chapterIdValidation,
   chapterNameValidation,
   statusValidation
];

// Delete Chapter Route Validation
const deleteChapterValidation = [idValidation];

router.get('/all', getAllChapters);
router.get('/:id', getChapterById);
router.post('/create', createChapterValidation, createChapter);
router.put('/update/:id', updateChapterValidation, updateChapter);
router.delete('/delete/:id', deleteChapterValidation, deleteChapter);
router.delete('/delete-all', deleteAllChapters);

module.exports = router;
