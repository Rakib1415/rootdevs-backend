const { validationResult } = require('express-validator');
const DailyMannaModel = require('../../models/DailyManna');
const formatApiResponse = require('../../helpers/formatApiResponse');

// Get all daily manna
exports.getAllDailyManna = async (req, res, next) => {
   try {
      const dailyMannas = await DailyMannaModel.find();

      res.status(200).json(
         formatApiResponse(true, 'daily mannas retrieved successfully', {
            dailyMannas
         })
      );
   } catch (error) {
      console.error('Error getting all daily manna:', error);
      next(error);
   }
};

// Get daily manna by ID
exports.getDailyMannaById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const dailyManna = await DailyMannaModel.findById(id);

      if (!dailyManna) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Daily Manna not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Daily Manna retrieved successfully', {
            dailyManna
         })
      );
   } catch (error) {
      console.error('Error getting daily manna by ID:', error);
      next(error);
   }
};

// Create a new daily manna
exports.createDailyManna = async (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { title, description, date } = req.body;

   try {
      const newDailyManna = await DailyMannaModel.create({
         title,
         description,
         date
      });

      res.status(201).json(
         formatApiResponse(true, 'Daily Manna created successfully', {
            newDailyManna
         })
      );
   } catch (error) {
      console.error('Error creating Daily Manna:', error);
      next(error);
   }
};

// Update daily manna by ID
exports.updateDailyMannaById = async (req, res, next) => {
   const { id } = req.params;
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { title, description, date } = req.body;

   try {
      const updatedDailyManna = await DailyMannaModel.findByIdAndUpdate(
         id,
         {
            title,
            description,
            date
         },
         { new: true }
      );

      if (!updatedDailyManna) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Daily Manna not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Daily Manna updated successfully', {
            updatedDailyManna
         })
      );
   } catch (error) {
      console.error('Error updating daily manna:', error);
      next(error);
   }
};

// Delete daily manna by ID
exports.deleteDailyMannaById = async (req, res, next) => {
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
      const dailyManna = await DailyMannaModel.findByIdAndDelete(id);

      if (!dailyManna) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Daily Manna not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Daily Manna deleted successfully', {
            dailyManna
         })
      );
   } catch (error) {
      console.error('Error deleting daily manna:', error);
      next(error);
   }
};

// Delete all daily manna
exports.deleteAllDailyManna = async (req, res, next) => {
   try {
      // Remove all documents from the Daily Manna collection
      const result = await DailyMannaModel.deleteMany();

      res.status(200).json(
         formatApiResponse(true, 'All daily manna deleted successfully', {
            deletedCount: result.deletedCount
         })
      );
   } catch (error) {
      console.error('Error deleting all daily manna:', error);
      next(error);
   }
};
