const express = require('express');
const { body, param } = require('express-validator');
const {
   getAllBooks,
   getBookById,
   createBook,
   updateBook,
   deleteBook,
   deleteAllBooks
} = require('../../controllers/admin/bookController');
const BookModel = require('../../models/Book');

const router = express.Router();

// Validation middleware
const languageValidation = body('language')
   .notEmpty()
   .withMessage('Language is required')
   .isMongoId()
   .withMessage('Invalid language ID');

const versionValidation = body('version')
   .notEmpty()
   .withMessage('Version is required')
   .isMongoId()
   .withMessage('Invalid version ID');

const collectionCodeValidation = body('collection_code')
   .notEmpty()
   .withMessage('Collection code is required')
   .isIn(['OT', 'NT', 'Both'])
   .withMessage('Invalid collection code value');

const bookIdValidation = body('book_id')
   .notEmpty()
   .withMessage('Book ID is required');
const bookNameValidation = body('book_name')
   .notEmpty()
   .withMessage('Book name is required');
const englishNameValidation = body('english_name').optional();
const bookOrderValidation = body('book_order').optional();
const numberOfChaptersValidation = body('number_of_chapters').optional();
const chaptersValidation = body('chapters').optional();
const statusValidation = body('status')
   .notEmpty()
   .withMessage('Status is required')
   .isIn(['0', '1'])
   .withMessage('Invalid status value');

const codeParamValidation = param('id')
   .notEmpty()
   .withMessage('Book ID parameter is required');

// Create Book Route Validation
const createBookValidation = [
   languageValidation,
   versionValidation,
   collectionCodeValidation,
   bookIdValidation,
   bookNameValidation,
   englishNameValidation,
   bookOrderValidation,
   numberOfChaptersValidation,
   chaptersValidation,
   statusValidation
];

const updateBookValidation = [
   codeParamValidation,
   languageValidation,
   versionValidation,
   collectionCodeValidation,
   bookIdValidation,
   bookNameValidation,
   englishNameValidation,
   bookOrderValidation,
   numberOfChaptersValidation,
   chaptersValidation,
   statusValidation
];

// Delete Book Route Validation
const deleteBookValidation = [codeParamValidation];

router.get('/all', getAllBooks);
router.get('/:id', getBookById);
router.post('/create', createBookValidation, createBook);
router.put('/update/:id', updateBookValidation, updateBook);
router.delete('/delete/:id', deleteBookValidation, deleteBook);
router.delete('/delete-all', deleteAllBooks);

module.exports = router;
