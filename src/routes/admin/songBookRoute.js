const express = require('express');
const { body, param } = require('express-validator');
const {
   getAllSongBooks,
   getSongBookById,
   createSongBook,
   updateSongBook,
   deleteSongBook,
   deleteAllSongBooks
} = require('../../controllers/admin/songBookController'); // Update the controller import

const router = express.Router();

// Validation middleware
const nameValidation = body('name').notEmpty().withMessage('Name is required');
const imageValidation = body('image')
   .notEmpty()
   .withMessage('Image is required');
const statusValidation = body('status')
   .notEmpty()
   .withMessage('Status is required')
   .isIn(['0', '1'])
   .withMessage('Invalid status value');
const idValidation = param('id').isMongoId().withMessage('Invalid ID format');

// Create SongBook Route Validation
const createSongBookValidation = [
   nameValidation,
   imageValidation,
   statusValidation
];

// Update SongBook Route Validation
const updateSongBookValidation = [
   idValidation,
   nameValidation,
   imageValidation,
   statusValidation
];

// Delete SongBook Route Validation
const deleteSongBookValidation = [idValidation];

router.get('/all', getAllSongBooks);
router.get('/:id', getSongBookById);
router.post('/create', createSongBookValidation, createSongBook);
router.put('/update/:id', updateSongBookValidation, updateSongBook);
router.delete('/delete/:id', deleteSongBookValidation, deleteSongBook);
router.delete('/delete-all', deleteAllSongBooks);

module.exports = router;
