const express = require('express');
const { body, param } = require('express-validator');
const {
   getAllPosterCategories,
   getPosterCategoryById,
   createPosterCategory,
   updatePosterCategory,
   deletePosterCategory,
   deleteAllPosterCategories
} = require('../../controllers/admin/posterCategoryController'); // Update the controller import

const router = express.Router();

// Validation middleware
const nameValidation = body('name').notEmpty().withMessage('Name is required');
const statusValidation = body('status')
   .notEmpty()
   .withMessage('Status is required')
   .isIn(['0', '1'])
   .withMessage('Invalid status value');
const idValidation = param('id').isMongoId().withMessage('Invalid ID format');

// Create Poster Category Route Validation
const createPosterCategoryValidation = [nameValidation, statusValidation];

// Update Poster Category Route Validation
const updatePosterCategoryValidation = [
   idValidation,
   nameValidation,
   statusValidation
];

// Delete Poster Category Route Validation
const deletePosterCategoryValidation = [idValidation];

router.get('/all', getAllPosterCategories);
router.get('/:id', getPosterCategoryById);
router.post('/create', createPosterCategoryValidation, createPosterCategory);
router.put('/update/:id', updatePosterCategoryValidation, updatePosterCategory);
router.delete(
   '/delete/:id',
   deletePosterCategoryValidation,
   deletePosterCategory
);
router.delete('/delete-all', deleteAllPosterCategories);

module.exports = router;
