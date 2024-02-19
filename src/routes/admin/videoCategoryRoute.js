const express = require('express');
const { body, param } = require('express-validator');
const {
   getAllVideoCategories,
   getVideoCategoryById,
   createVideoCategory,
   updateVideoCategory,
   deleteVideoCategory,
   deleteAllVideoCategories
} = require('../../controllers/admin/videoCategoryController');

const router = express.Router();

// Validation middleware
const nameValidation = body('name').notEmpty().withMessage('Name is required');
const statusValidation = body('status')
   .notEmpty()
   .withMessage('Status is required')
   .isIn(['0', '1'])
   .withMessage('Invalid status value');
const idValidation = param('id').isMongoId().withMessage('Invalid ID format');

// Create Video Category Route Validation
const createVideoCategoryValidation = [nameValidation, statusValidation];

// Update Video Category Route Validation
const updateVideoCategoryValidation = [
   idValidation,
   nameValidation,
   statusValidation
];

// Delete Video Category Route Validation
const deleteVideoCategoryValidation = [idValidation];

router.get('/all', getAllVideoCategories);
router.get('/:id', getVideoCategoryById);
router.post('/create', createVideoCategoryValidation, createVideoCategory);
router.put('/update/:id', updateVideoCategoryValidation, updateVideoCategory);
router.delete(
   '/delete/:id',
   deleteVideoCategoryValidation,
   deleteVideoCategory
);
router.delete('/delete-all', deleteAllVideoCategories);

module.exports = router;
