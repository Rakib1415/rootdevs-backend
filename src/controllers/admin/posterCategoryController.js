const { validationResult } = require('express-validator');
const PosterCategoryModel = require('../../models/PosterCategory');
const formatApiResponse = require('../../helpers/formatApiResponse');

// Get all Poster Categories
exports.getAllPosterCategories = async (req, res, next) => {
   try {
      const posterCategories = await PosterCategoryModel.find();
      res.status(200).json(
         formatApiResponse(true, 'Poster categories retrieved successfully', {
            posterCategories
         })
      );
   } catch (error) {
      console.error('Error getting all poster categories:', error);
      next(error);
   }
};

// Get Poster Category by ID
exports.getPosterCategoryById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const posterCategory = await PosterCategoryModel.findById(id);
      if (!posterCategory) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Poster category not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Poster category retrieved successfully', {
            posterCategory
         })
      );
   } catch (error) {
      console.error('Error getting poster category by ID:', error);
      next(error);
   }
};

// Create a new Poster Category
exports.createPosterCategory = async (req, res, next) => {
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
      const newPosterCategory = await PosterCategoryModel.create({
         name,
         status
      });

      res.status(201).json(
         formatApiResponse(true, 'Poster category created successfully', {
            newPosterCategory
         })
      );
   } catch (error) {
      console.error('Error creating poster category:', error);
      next(error);
   }
};

// Update Poster Category by ID
exports.updatePosterCategory = async (req, res, next) => {
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
      const updatedPosterCategory = await PosterCategoryModel.findByIdAndUpdate(
         id,
         { name, status },
         { new: true }
      );

      if (!updatedPosterCategory) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Poster category not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Poster category updated successfully', {
            updatedPosterCategory
         })
      );
   } catch (error) {
      console.error('Error updating poster category:', error);
      next(error);
   }
};

// Delete Poster Category by ID
exports.deletePosterCategory = async (req, res, next) => {
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
      const deletedPosterCategory = await PosterCategoryModel.findByIdAndDelete(
         id
      );

      if (!deletedPosterCategory) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Poster category not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Poster category deleted successfully', {
            deletedPosterCategory
         })
      );
   } catch (error) {
      console.error('Error deleting poster category:', error);
      next(error);
   }
};

// Delete all Poster Categories
exports.deleteAllPosterCategories = async (req, res, next) => {
   try {
      // Remove all documents from the PosterCategory collection
      const result = await PosterCategoryModel.deleteMany();

      res.status(200).json(
         formatApiResponse(true, 'All poster categories deleted successfully', {
            deletedCount: result.deletedCount
         })
      );
   } catch (error) {
      console.error('Error deleting all poster categories:', error);
      next(error);
   }
};
