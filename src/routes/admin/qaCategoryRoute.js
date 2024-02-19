const express = require('express');
const { body, param } = require('express-validator');
const {
   getAllQaCategories,
   getQaCategoryById,
   createQaCategory,
   updateQaCategory,
   deleteQaCategory,
   deleteAllQaCategories
} = require('../../controllers/admin/qaCategoryController'); // Update the controller import

const router = express.Router();

// Validation middleware
const nameValidation = body('name').notEmpty().withMessage('Name is required');
const statusValidation = body('status')
   .notEmpty()
   .withMessage('Status is required')
   .isIn(['0', '1'])
   .withMessage('Invalid status value');
const idValidation = param('id').isMongoId().withMessage('Invalid ID format');

// Create QaCategory Route Validation
const createQaCategoryValidation = [nameValidation, statusValidation];

// Update QaCategory Route Validation
const updateQaCategoryValidation = [
   idValidation,
   nameValidation,
   statusValidation
];

// Delete QaCategory Route Validation
const deleteQaCategoryValidation = [idValidation];

router.get('/all', getAllQaCategories);
router.get('/:id', getQaCategoryById);
router.post('/create', createQaCategoryValidation, createQaCategory);
router.put('/update/:id', updateQaCategoryValidation, updateQaCategory);
router.delete('/delete/:id', deleteQaCategoryValidation, deleteQaCategory);
router.delete('/delete-all', deleteAllQaCategories);

module.exports = router;
