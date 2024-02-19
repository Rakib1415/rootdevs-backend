const express = require('express');
const { body, param } = require('express-validator');
const {
   getAllLanguages,
   getLanguageByCode,
   createLanguage,
   updateLanguage,
   deleteLanguage,
   deleteAllLanguages
} = require('../../controllers/admin/languageController');
const LanguageModel = require('../../models/Language');

const router = express.Router();

// Validation middleware
const codeValidation = body('language_code')
   .notEmpty()
   .withMessage('Language code is required')
   .custom(async (value, { req }) => {
      // Check if the language_code is unique when creating or updating
      const filter = { language_code: value };
      if (req.params.code) {
         filter._id = { $ne: req.params.code }; // Exclude the current language when updating
      }

      const existingLanguage = await LanguageModel.findOne(filter);
      if (existingLanguage) {
         return Promise.reject('Language code must be unique');
      }
   });

const nameValidation = body('language_name')
   .notEmpty()
   .withMessage('Language name is required');
const englishNameValidation = body('english_name')
   .notEmpty()
   .withMessage('English name is required');
const verseTextValidation = body('verse_text')
   .optional()
   .isIn(['0', '1'])
   .withMessage('Invalid verse text value');
const audioValidation = body('audio')
   .optional()
   .isIn(['0', '1'])
   .withMessage('Invalid audio value');
const popularValidation = body('popular')
   .optional()
   .isIn(['0', '1'])
   .withMessage('Invalid popular value');
const statusValidation = body('status')
   .notEmpty()
   .withMessage('Status is required')
   .isIn(['0', '1'])
   .withMessage('Invalid status value');
const codeParamValidation = param('code')
   .notEmpty()
   .withMessage('Language code parameter is required');

// Create Language Route Validation
const createLanguageValidation = [
   codeValidation,
   nameValidation,
   englishNameValidation,
   verseTextValidation,
   audioValidation,
   popularValidation,
   statusValidation
];

const updateLanguageValidation = [
   codeParamValidation,
   nameValidation,
   englishNameValidation,
   verseTextValidation,
   audioValidation,
   popularValidation,
   statusValidation
];

// Delete Language Route Validation
const deleteLanguageValidation = [codeParamValidation];

router.get('/all', getAllLanguages);
router.get('/:code', getLanguageByCode);
router.post('/create', createLanguageValidation, createLanguage);
router.put('/update/:code', updateLanguageValidation, updateLanguage);
router.delete('/delete/:code', deleteLanguageValidation, deleteLanguage);
router.delete('/delete-all', deleteAllLanguages);

module.exports = router;
