const express = require('express');
const { body, param } = require('express-validator');
const {
   getAllContentManagements,
   getContentManagementById,
   createContentManagement,
   updateContentManagement,
   deleteContentManagement,
   deleteAllContentManagements
} = require('../../controllers/admin/contentManagementController');

const router = express.Router();

// Validation middleware
const titleValidation = body('title')
   .notEmpty()
   .withMessage('Title is required');
const contentValidation = body('content')
   .notEmpty()
   .withMessage('Content is required');
const statusValidation = body('status')
   .notEmpty()
   .withMessage('Status is required')
   .isIn(['0', '1'])
   .withMessage('Invalid status value');
const idValidation = param('id').isMongoId().withMessage('Invalid ID format');

// Create Content Management Route Validation
const createContentManagementValidation = [
   titleValidation,
   contentValidation,
   statusValidation
];

// Update Content Management Route Validation
const updateContentManagementValidation = [
   idValidation,
   titleValidation,
   contentValidation,
   statusValidation
];

// Delete Content Management Route Validation
const deleteContentManagementValidation = [idValidation];

router.get('/all', getAllContentManagements);
router.get('/:id', getContentManagementById);
router.post(
   '/create',
   createContentManagementValidation,
   createContentManagement
);
router.put(
   '/update/:id',
   updateContentManagementValidation,
   updateContentManagement
);
router.delete(
   '/delete/:id',
   deleteContentManagementValidation,
   deleteContentManagement
);
router.delete('/delete-all', deleteAllContentManagements);

module.exports = router;
