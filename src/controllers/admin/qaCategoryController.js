const { validationResult } = require('express-validator');
const formatApiResponse = require('../../helpers/formatApiResponse');
const QaCategoryModel = require('../../models/QaCategory');

// Get all Qa categories
exports.getAllQaCategories = async (req, res, next) => {
   try {
      const qaCategories = await QaCategoryModel.find();
      res.status(200).json(
         formatApiResponse(true, 'Qa categories retrieved successfully', {
            qaCategories
         })
      );
   } catch (error) {
      console.error('Error getting all Qa categories:', error);
      next(error);
   }
};

// Get Qa category by ID
exports.getQaCategoryById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const qaCategory = await QaCategoryModel.findById(id);
      if (!qaCategory) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Qa category not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Qa category retrieved successfully', {
            qaCategory
         })
      );
   } catch (error) {
      console.error('Error getting Qa category by ID:', error);
      next(error);
   }
};

// Create a new Qa category
exports.createQaCategory = async (req, res, next) => {
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
      const newQaCategory = await QaCategoryModel.create({
         name,
         status
      });

      res.status(201).json(
         formatApiResponse(true, 'Qa category created successfully', {
            newQaCategory
         })
      );
   } catch (error) {
      console.error('Error creating Qa category:', error);
      next(error);
   }
};

// Update Qa category by ID
exports.updateQaCategory = async (req, res, next) => {
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
      const updatedQaCategory = await QaCategoryModel.findByIdAndUpdate(
         id,
         { name, status },
         { new: true }
      );

      if (!updatedQaCategory) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Qa category not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Qa category updated successfully', {
            updatedQaCategory
         })
      );
   } catch (error) {
      console.error('Error updating Qa category:', error);
      next(error);
   }
};

// Delete Qa category by ID
exports.deleteQaCategory = async (req, res, next) => {
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
      const deletedQaCategory = await QaCategoryModel.findByIdAndDelete(id);

      if (!deletedQaCategory) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Qa category not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Qa category deleted successfully', {
            deletedQaCategory
         })
      );
   } catch (error) {
      console.error('Error deleting Qa category:', error);
      next(error);
   }
};

// Delete all Qa categories
exports.deleteAllQaCategories = async (req, res, next) => {
   try {
      // Remove all documents from the QaCategory collection
      const result = await QaCategoryModel.deleteMany();

      res.status(200).json(
         formatApiResponse(true, 'All Qa categories deleted successfully', {
            deletedCount: result.deletedCount
         })
      );
   } catch (error) {
      console.error('Error deleting all Qa categories:', error);
      next(error);
   }
};
