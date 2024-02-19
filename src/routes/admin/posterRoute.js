const express = require('express');
const { body, param } = require('express-validator');
const {
   getAllPosters,
   getPosterById,
   createPoster,
   updatePoster,
   deletePoster,
   deleteAllPosters
} = require('../../controllers/admin/posterController'); 

const router = express.Router();

// Validation middleware
const categoryValidation = body('poster_category').notEmpty().withMessage('Poster Category is required');
const titleValidation = body('title').notEmpty().withMessage('Title is required');
const imageValidation = body('image').optional().isURL().withMessage('Invalid image URL format');
const descriptionValidation = body('description').optional().isString().withMessage('Description should be a string');
const statusValidation = body('status')
   .notEmpty()
   .withMessage('Status is required')
   .isIn(['0', '1'])
   .withMessage('Invalid status value');
const idValidation = param('id').isMongoId().withMessage('Invalid ID format');

// Create Poster Route Validation
const createPosterValidation = [categoryValidation, titleValidation, imageValidation, descriptionValidation, statusValidation];

// Update Poster Route Validation
const updatePosterValidation = [idValidation, categoryValidation, titleValidation, imageValidation, descriptionValidation, statusValidation];

// Delete Poster Route Validation
const deletePosterValidation = [idValidation];

router.get('/all', getAllPosters);
router.get('/:id', getPosterById);
router.post('/create', createPosterValidation, createPoster);
router.put('/update/:id', updatePosterValidation, updatePoster);
router.delete('/delete/:id', deletePosterValidation, deletePoster);
router.delete('/delete-all', deleteAllPosters);

module.exports = router;
