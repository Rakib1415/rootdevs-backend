const { validationResult } = require('express-validator');
const VerseModel = require('../../models/Verse');
const formatApiResponse = require('../../helpers/formatApiResponse');

// Get all verses
exports.getAllVerses = async (req, res, next) => {
   try {
      const verses = await VerseModel.find(
         {},
         { verse_id: 0, createdAt: 0, updatedAt: 0, __v: 0 }
      )
         .populate({
            path: 'language',
            select: { verse_text: 0, audio: 0, popular: 0 }
         })
         .populate({
            path: 'version',
            select: { version_code: 0, language: 0 }
         })
         .populate({ path: 'book', select: { version: 0, language: 0 } })
         .populate({
            path: 'chapter',
            select: { version: 0, language: 0, chapter_id: 0 },
            populate: { path: 'book' }
         });

      res.status(200).json(
         formatApiResponse(true, 'Verses retrieved successfully', {
            verses
         })
      );
   } catch (error) {
      console.error('Error getting all verses:', error);
      next(error);
   }
};

// Get verse by ID
exports.getVerseById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const verse = await VerseModel.findById(id)
         .populate('language')
         .populate('version')
         .populate('book')
         .populate('chapter');

      if (!verse) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Verse not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Verse retrieved successfully', {
            verse
         })
      );
   } catch (error) {
      console.error('Error getting verse by ID:', error);
      next(error);
   }
};

// Create a new verse
exports.createVerse = async (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { language, version, book, chapter, verse_text, verse_id, status } =
      req.body;

   try {
      const newVerse = await VerseModel.create({
         language,
         version,
         book,
         chapter,
         verse_text,
         verse_id,
         status
      });

      res.status(201).json(
         formatApiResponse(true, 'Verse created successfully', {
            newVerse
         })
      );
   } catch (error) {
      console.error('Error creating verse:', error);
      next(error);
   }
};

// Update verse by ID
exports.updateVerse = async (req, res, next) => {
   const { id } = req.params;
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { language, version, book, chapter, verse_text, verse_id, status } =
      req.body;

   try {
      const updatedVerse = await VerseModel.findByIdAndUpdate(
         id,
         {
            language,
            version,
            book,
            chapter,
            verse_text,
            verse_id,
            status
         },
         { new: true }
      )
         .populate('language')
         .populate('version')
         .populate('book')
         .populate('chapter');

      if (!updatedVerse) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Verse not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Verse updated successfully', {
            updatedVerse
         })
      );
   } catch (error) {
      console.error('Error updating verse:', error);
      next(error);
   }
};

// Delete verse by ID
exports.deleteVerse = async (req, res, next) => {
   const { id } = req.params;
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   try {
      const deletedVerse = await VerseModel.findByIdAndDelete(id)
         .populate('language')
         .populate('version')
         .populate('book')
         .populate('chapter');

      if (!deletedVerse) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Verse not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Verse deleted successfully', {
            deletedVerse
         })
      );
   } catch (error) {
      console.error('Error deleting verse:', error);
      next(error);
   }
};

// Delete all verses
exports.deleteAllVerses = async (req, res, next) => {
   try {
      // Remove all documents from the Verse collection
      const result = await VerseModel.deleteMany();

      res.status(200).json(
         formatApiResponse(true, 'All verses deleted successfully', {
            deletedCount: result.deletedCount
         })
      );
   } catch (error) {
      console.error('Error deleting all verses:', error);
      next(error);
   }
};

// get verse text controller
exports.getVerseByText = async (req, res, next) => {
   const { language, book, version, chapter } = req.query;

   try {
      const verse = await VerseModel.aggregate([
         {
            $lookup: {
               from: 'languages',
               localField: 'language',
               foreignField: '_id',
               as: 'language'
            }
         },
         {
            $match: { 'language.language_name': { $eq: language } }
         },
         {
            $lookup: {
               from: 'versions',
               localField: 'version',
               foreignField: '_id',
               as: 'version'
            }
         },
         {
            $match: { 'version.volume_name': { $eq: version } }
         },
         {
            $lookup: {
               from: 'books',
               localField: 'book',
               foreignField: '_id',
               as: 'book'
            }
         },
         {
            $match: { 'book.book_name': { $eq: book } }
         },
         {
            $lookup: {
               from: 'chapters',
               localField: 'chapter',
               foreignField: '_id',
               as: 'chapter'
            }
         },
         {
            $match: { 'chapter.chapter_name': { $eq: chapter } }
         }
      ]);
      res.status(200).json(
         formatApiResponse(true, 'verse text retrieved successfully', {
            verse
         })
      );
   } catch (error) {
      console.error('Error get verse by text:', error);
      next(error);
   }
};
