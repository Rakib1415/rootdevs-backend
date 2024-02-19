const express = require('express');
const { body, param } = require('express-validator');
const {
   getAllQas,
   getQaById,
   createQa,
   updateQa,
   deleteQa,
   deleteAllQas
} = require('../../controllers/admin/qaController'); // Update the controller import

const router = express.Router();

// Validation middleware
const categoryValidation = body('category')
   .notEmpty()
   .withMessage('Category is required');
const questionValidation = body('question')
   .notEmpty()
   .withMessage('Question is required');
const answerValidation = body('answer')
   .notEmpty()
   .withMessage('Answer is required');
const statusValidation = body('status')
   .notEmpty()
   .withMessage('Status is required')
   .isIn(['0', '1'])
   .withMessage('Invalid status value');
const idValidation = param('id').isMongoId().withMessage('Invalid ID format');

// Create Qa Route Validation
const createQaValidation = [
   categoryValidation,
   questionValidation,
   answerValidation,
   statusValidation
];

// Update Qa Route Validation
const updateQaValidation = [
   idValidation,
   categoryValidation,
   questionValidation,
   answerValidation,
   statusValidation
];

// Delete Qa Route Validation
const deleteQaValidation = [idValidation];

router.get('/all', getAllQas);
router.get('/:id', getQaById);
router.post('/create', createQaValidation, createQa);
router.put('/update/:id', updateQaValidation, updateQa);
router.delete('/delete/:id', deleteQaValidation, deleteQa);
router.delete('/delete-all', deleteAllQas);

module.exports = router;
