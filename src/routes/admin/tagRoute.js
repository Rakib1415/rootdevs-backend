const router = require('express').Router();
const { body, param } = require('express-validator');
const {
   createTag,
   getAllTags,
   updateTag,
   deleteTag,
   deleteAllTags
} = require('../../controllers/admin/tagController');

const WordValidation = body('word').notEmpty().withMessage('word is required');

const versionValidation = body('version')
   .notEmpty()
   .withMessage('Version is required')
   .isMongoId()
   .withMessage('Invalid version Id');

const bookValidation = body('book')
   .notEmpty()
   .withMessage('Book is required')
   .isMongoId()
   .withMessage('Invalid book Id');

const chapterValidation = body('chapter')
   .notEmpty()
   .withMessage('Chapter is required')
   .isMongoId()
   .withMessage('Invalid chapter Id');

const verseValidation = body('verse')
   .notEmpty()
   .withMessage('Verse is required')
   .isMongoId()
   .withMessage('Invalid verse Id');

const codeParamValidation = param('id')
   .notEmpty()
   .withMessage('Tag ID parameter is required');

// create tag validation
const createTagValidation = [
   WordValidation,
   versionValidation,
   bookValidation,
   chapterValidation,
   verseValidation
];

// update tag validation
const updateTagValidation = [
   codeParamValidation,
   WordValidation,
   versionValidation,
   bookValidation,
   chapterValidation,
   verseValidation
];

router.post('/create', createTagValidation, createTag);
router.get('/all', getAllTags);
router.put('/update/:id', updateTagValidation, updateTag);
router.delete('/delete/:id', codeParamValidation, deleteTag);
router.delete('/delete-all', deleteAllTags);

module.exports = router;
