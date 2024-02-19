const { validationResult } = require('express-validator');
const LanguageModel = require('../../models/Language');
const formatApiResponse = require('../../helpers/formatApiResponse');

// Get all Languages
exports.getAllLanguages = async (req, res, next) => {
   try {
      const languages = await LanguageModel.find();
      res.status(200).json(
         formatApiResponse(true, 'Languages retrieved successfully', {
            languages
         })
      );
   } catch (error) {
      console.error('Error getting all languages:', error);
      next(error);
   }
};

// Get Language by Code
exports.getLanguageByCode = async (req, res, next) => {
   const { code } = req.params;

   try {
      const language = await LanguageModel.findOne({ language_code: code });
      if (!language) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Language not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Language retrieved successfully', {
            language
         })
      );
   } catch (error) {
      console.error('Error getting language by code:', error);
      next(error);
   }
};

// Create a new Language
exports.createLanguage = async (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const {
      language_code,
      language_name,
      english_name,
      verse_text,
      audio,
      popular,
      status
   } = req.body;

   try {
      const newLanguage = await LanguageModel.create({
         language_code,
         language_name,
         english_name,
         verse_text,
         audio,
         popular,
         status
      });

      res.status(201).json(
         formatApiResponse(true, 'Language created successfully', {
            newLanguage
         })
      );
   } catch (error) {
      if (
         error.code === 11000 &&
         error.keyPattern &&
         error.keyPattern.language_code
      ) {
         // Duplicate key error, indicating a non-unique language_code
         return res.status(400).json(
            formatApiResponse(false, 'Validation error', {
               errors: [{ msg: 'Language code must be unique' }]
            })
         );
      }
      console.error('Error creating language:', error);
      next(error);
   }
};

// Update Language by Code
exports.updateLanguage = async (req, res, next) => {
   const { code } = req.params;
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { language_name, english_name, verse_text, audio, popular, status } =
      req.body;

   try {
      const updatedLanguage = await LanguageModel.findOneAndUpdate(
         { language_code: code },
         {
            language_name,
            english_name,
            verse_text,
            audio,
            popular,
            status
         },
         { new: true }
      );

      if (!updatedLanguage) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Language not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Language updated successfully', {
            updatedLanguage
         })
      );
   } catch (error) {
      if (
         error.code === 11000 &&
         error.keyPattern &&
         error.keyPattern.language_code
      ) {
         // Duplicate key error, indicating a non-unique language_code
         return res.status(400).json(
            formatApiResponse(false, 'Validation error', {
               errors: [{ msg: 'Language code must be unique' }]
            })
         );
      }
      console.error('Error updating language:', error);
      next(error);
   }
};

// Delete Language by Code
exports.deleteLanguage = async (req, res, next) => {
   const { code } = req.params;
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   try {
      const deletedLanguage = await LanguageModel.findOneAndDelete({
         language_code: code
      });

      if (!deletedLanguage) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Language not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Language deleted successfully', {
            deletedLanguage
         })
      );
   } catch (error) {
      console.error('Error deleting language:', error);
      next(error);
   }
};

// Delete all Languages
exports.deleteAllLanguages = async (req, res, next) => {
   try {
      // Remove all documents from the Language collection
      const result = await LanguageModel.deleteMany();

      res.status(200).json(
         formatApiResponse(true, 'All languages deleted successfully', {
            deletedCount: result.deletedCount
         })
      );
   } catch (error) {
      console.error('Error deleting all languages:', error);
      next(error);
   }
};
