const { validationResult } = require('express-validator');
const ChapterModel = require('../../models/Chapter');
const formatApiResponse = require('../../helpers/formatApiResponse');

// Get all chapters
exports.getAllChapters = async (req, res, next) => {
   try {
      const chapters = await ChapterModel.find()
         .populate('language')
         .populate('version')
         .populate('book');

      res.status(200).json(
         formatApiResponse(true, 'Chapters retrieved successfully', {
            chapters
         })
      );
   } catch (error) {
      console.error('Error getting all chapters:', error);
      next(error);
   }
};

// Get chapter by ID
exports.getChapterById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const chapter = await ChapterModel.findById(id)
         .populate('language')
         .populate('version')
         .populate('book');

      if (!chapter) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Chapter not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Chapter retrieved successfully', {
            chapter
         })
      );
   } catch (error) {
      console.error('Error getting chapter by ID:', error);
      next(error);
   }
};

// Create a new chapter
exports.createChapter = async (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { language, version, book, chapter_id, chapter_name, status } =
      req.body;

   try {
      const newChapter = await ChapterModel.create({
         language,
         version,
         book,
         chapter_id,
         chapter_name,
         status
      });

      res.status(201).json(
         formatApiResponse(true, 'Chapter created successfully', {
            newChapter
         })
      );
   } catch (error) {
      console.error('Error creating chapter:', error);
      next(error);
   }
};

// Update chapter by ID
exports.updateChapter = async (req, res, next) => {
   const { id } = req.params;
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { language, version, book, chapter_id, chapter_name, status } =
      req.body;

   try {
      const updatedChapter = await ChapterModel.findByIdAndUpdate(
         id,
         {
            language,
            version,
            book,
            chapter_id,
            chapter_name,
            status
         },
         { new: true }
      )
         .populate('language')
         .populate('version')
         .populate('book');

      if (!updatedChapter) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Chapter not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Chapter updated successfully', {
            updatedChapter
         })
      );
   } catch (error) {
      console.error('Error updating chapter:', error);
      next(error);
   }
};

// Delete chapter by ID
exports.deleteChapter = async (req, res, next) => {
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
      const deletedChapter = await ChapterModel.findByIdAndDelete(id)
         .populate('language')
         .populate('version')
         .populate('book');

      if (!deletedChapter) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Chapter not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Chapter deleted successfully', {
            deletedChapter
         })
      );
   } catch (error) {
      console.error('Error deleting chapter:', error);
      next(error);
   }
};

// Delete all chapters
exports.deleteAllChapters = async (req, res, next) => {
   try {
      // Remove all documents from the Chapter collection
      const result = await ChapterModel.deleteMany();

      res.status(200).json(
         formatApiResponse(true, 'All chapters deleted successfully', {
            deletedCount: result.deletedCount
         })
      );
   } catch (error) {
      console.error('Error deleting all chapters:', error);
      next(error);
   }
};
