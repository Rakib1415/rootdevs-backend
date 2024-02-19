const { validationResult } = require('express-validator');
const ContentManagementModel = require('../../models/ContentManagement');
const formatApiResponse = require('../../helpers/formatApiResponse');

// Get all Content Managements
exports.getAllContentManagements = async (req, res, next) => {
   try {
      const contentManagements = await ContentManagementModel.find();
      res.status(200).json(
         formatApiResponse(true, 'Content managements retrieved successfully', {
            contentManagements
         })
      );
   } catch (error) {
      console.error('Error getting all content managements:', error);
      next(error);
   }
};

// Get Content Management by ID
exports.getContentManagementById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const contentManagement = await ContentManagementModel.findById(id);
      if (!contentManagement) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Content management not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Content management retrieved successfully', {
            contentManagement
         })
      );
   } catch (error) {
      console.error('Error getting content management by ID:', error);
      next(error);
   }
};

// Create a new Content Management
exports.createContentManagement = async (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { title, content, status } = req.body;

   try {
      const newContentManagement = await ContentManagementModel.create({
         title,
         content,
         status
      });

      res.status(201).json(
         formatApiResponse(true, 'Content management created successfully', {
            newContentManagement
         })
      );
   } catch (error) {
      console.error('Error creating content management:', error);
      next(error);
   }
};

// Update Content Management by ID
exports.updateContentManagement = async (req, res, next) => {
   const { id } = req.params;
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { title, content, status } = req.body;

   try {
      const updatedContentManagement =
         await ContentManagementModel.findByIdAndUpdate(
            id,
            { title, content, status },
            { new: true }
         );

      if (!updatedContentManagement) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Content management not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Content management updated successfully', {
            updatedContentManagement
         })
      );
   } catch (error) {
      console.error('Error updating content management:', error);
      next(error);
   }
};

// Delete Content Management by ID
exports.deleteContentManagement = async (req, res, next) => {
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
      const deletedContentManagement =
         await ContentManagementModel.findByIdAndDelete(id);

      if (!deletedContentManagement) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Content management not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Content management deleted successfully', {
            deletedContentManagement
         })
      );
   } catch (error) {
      console.error('Error deleting content management:', error);
      next(error);
   }
};

// Delete all Content Managements
exports.deleteAllContentManagements = async (req, res, next) => {
   try {
      // Remove all documents from the ContentManagement collection
      const result = await ContentManagementModel.deleteMany();

      res.status(200).json(
         formatApiResponse(
            true,
            'All content managements deleted successfully',
            {
               deletedCount: result.deletedCount
            }
         )
      );
   } catch (error) {
      console.error('Error deleting all content managements:', error);
      next(error);
   }
};
