const { validationResult } = require('express-validator');
const VideoCategoryModel = require('../../models/VideoCategory');
const formatApiResponse = require('../../helpers/formatApiResponse');

// Get all video categories
exports.getAllVideoCategories = async (req, res, next) => {
   try {
      const videoCategories = await VideoCategoryModel.find();
      res.status(200).json(
         formatApiResponse(true, 'Video categories retrieved successfully', {
            videoCategories
         })
      );
   } catch (error) {
      console.error('Error getting all video categories:', error);
      next(error);
   }
};

// Get video category by ID
exports.getVideoCategoryById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const videoCategory = await VideoCategoryModel.findById(id);
      if (!videoCategory) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Video category not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Video category retrieved successfully', {
            videoCategory
         })
      );
   } catch (error) {
      console.error('Error getting video category by ID:', error);
      next(error);
   }
};

// Create a new video category
exports.createVideoCategory = async (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { name, status } = req.body;

   try {
      const newVideoCategory = await VideoCategoryModel.create({
         name,
         status
      });

      res.status(201).json(
         formatApiResponse(true, 'Video category created successfully', {
            newVideoCategory
         })
      );
   } catch (error) {
      console.error('Error creating video category:', error);
      next(error);
   }
};

// Update video category by ID
exports.updateVideoCategory = async (req, res, next) => {
   const { id } = req.params;
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { name, status } = req.body;

   try {
      const updatedVideoCategory = await VideoCategoryModel.findByIdAndUpdate(
         id,
         { name, status },
         { new: true }
      );

      if (!updatedVideoCategory) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Video category not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Video category updated successfully', {
            updatedVideoCategory
         })
      );
   } catch (error) {
      console.error('Error updating video category:', error);
      next(error);
   }
};

// Delete video category by ID
exports.deleteVideoCategory = async (req, res, next) => {
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
      const deletedVideoCategory = await VideoCategoryModel.findByIdAndDelete(
         id
      );

      if (!deletedVideoCategory) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Video category not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Video category deleted successfully', {
            deletedVideoCategory
         })
      );
   } catch (error) {
      console.error('Error deleting video category:', error);
      next(error);
   }
};

// Delete all video categories
exports.deleteAllVideoCategories = async (req, res, next) => {
   try {
      // Remove all documents from the VideoCategory collection
      const result = await VideoCategoryModel.deleteMany();

      res.status(200).json(
         formatApiResponse(true, 'All video categories deleted successfully', {
            deletedCount: result.deletedCount
         })
      );
   } catch (error) {
      console.error('Error deleting all video categories:', error);
      next(error);
   }
};
