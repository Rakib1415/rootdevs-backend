const { validationResult } = require('express-validator');
const TagModel = require('../../models/Tag');
const formatApiResponse = require('../../helpers/formatApiResponse');

// Get all tags
exports.getAllTags = async (req, res, next) => {
   try {
      const tags = await TagModel.find()
         .populate('version')
         .populate('book')
         .populate('chapter')
         .populate('verse');
      res.status(200).json(
         formatApiResponse(true, 'Tags retrieved successfully', {
            tags
         })
      );
   } catch (error) {
      console.error('Error getting all tags:', error);
      next(error);
   }
};

// Get tag by ID
exports.getTagById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const tag = await TagModel.findById(id)
         .populate('version')
         .populate('book')
         .populate('chapter')
         .populate('verse');
      if (!tag) {
         return res.status(404).json(formatApiResponse(false, 'Tag not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Tag retrieved successfully', {
            tag
         })
      );
   } catch (error) {
      console.error('Error getting tag by ID:', error);
      next(error);
   }
};

// Create a new tag
exports.createTag = async (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { word, version, book, chapter, verse } = req.body;

   try {
      const newTag = await TagModel.create({
         word,
         version,
         book,
         chapter,
         verse
      });

      res.status(201).json(
         formatApiResponse(true, 'Tag created successfully', {
            newTag
         })
      );
   } catch (error) {
      console.error('Error creating tag:', error);
      next(error);
   }
};

// Update tag by ID
exports.updateTag = async (req, res, next) => {
   const { id } = req.params;
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { word, version, book, chapter, verse } = req.body;

   try {
      const updatedTag = await TagModel.findByIdAndUpdate(
         id,
         {
            word,
            version,
            book,
            chapter,
            verse
         },
         { new: true }
      )
         .populate('version')
         .populate('book')
         .populate('chapter')
         .populate('verse');

      if (!updatedTag) {
         return res.status(404).json(formatApiResponse(false, 'Tag not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Tag updated successfully', {
            updatedTag
         })
      );
   } catch (error) {
      console.error('Error updating tag:', error);
      next(error);
   }
};

// Delete tag by ID
exports.deleteTag = async (req, res, next) => {
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
      const deletedTag = await TagModel.findByIdAndDelete(id)
         .populate('version')
         .populate('book')
         .populate('chapter')
         .populate('verse');

      if (!deletedTag) {
         return res.status(404).json(formatApiResponse(false, 'Tag not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Tag deleted successfully', {
            deletedTag
         })
      );
   } catch (error) {
      console.error('Error deleting tag:', error);
      next(error);
   }
};

// Delete all tags
exports.deleteAllTags = async (req, res, next) => {
   try {
      // Remove all documents from the Tag collection
      const result = await TagModel.deleteMany();

      res.status(200).json(
         formatApiResponse(true, 'All tags deleted successfully', {
            deletedCount: result.deletedCount
         })
      );
   } catch (error) {
      console.error('Error deleting all tags:', error);
      next(error);
   }
};
