const router = require('express').Router();
const { body, param } = require('express-validator');
const {
   createDictionary,
   getAllDictionary,
   getDictionaryById,
   deleteDictionary,
   deleteAllDictionary,
   updateDictionary
} = require('../../controllers/admin/dictionaryController');

const wordValidation = body('word').notEmpty().withMessage('word is required');

const wordInEnglishValidation = body('word_in_english')
   .notEmpty()
   .withMessage('word_in_english is required');

const definationValidation = body('defination')
   .notEmpty()
   .withMessage('defination is required');

const tagsValidation = body('tags')
   .isArray()
   .withMessage('tags must be an array');

const examplesValidation = body('examples')
   .isArray()
   .withMessage('examples must be an array');

const codeParamValidation = param('id')
   .notEmpty()
   .withMessage('Dictionary ID parameter is required');

// create dictionary validation
const createDictionaryValidation = [
   wordValidation,
   wordInEnglishValidation,
   definationValidation,
   tagsValidation,
   examplesValidation
];

// update dictionary validation
const updateDictionaryValidation = [
   codeParamValidation,
   wordValidation,
   wordInEnglishValidation,
   definationValidation,
   tagsValidation,
   examplesValidation
];

router.post('/create', createDictionaryValidation, createDictionary);
router.get('/all', getAllDictionary);
router.get('/:id', codeParamValidation, getDictionaryById);
router.put('/update/:id', updateDictionaryValidation, updateDictionary);
router.delete('/delete/:id', codeParamValidation, deleteDictionary);
router.delete('/delete-all', deleteAllDictionary);

module.exports = router;
