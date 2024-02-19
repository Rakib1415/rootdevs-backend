const { validationResult } = require('express-validator');
const QaModel = require('../../models/Qa');
const formatApiResponse = require('../../helpers/formatApiResponse');

// Get all Qas
exports.getAllQas = async (req, res, next) => {
   try {
      const qas = await QaModel.find();
      res.status(200).json(
         formatApiResponse(true, 'Qas retrieved successfully', {
            qas
         })
      );
   } catch (error) {
      console.error('Error getting all Qas:', error);
      next(error);
   }
};

// Get Qa by ID
exports.getQaById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const qa = await QaModel.findById(id);
      if (!qa) {
         return res.status(404).json(formatApiResponse(false, 'Qa not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Qa retrieved successfully', {
            qa
         })
      );
   } catch (error) {
      console.error('Error getting Qa by ID:', error);
      next(error);
   }
};

// Create a new Qa
exports.createQa = async (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { category, question, answer, status } = req.body;

   try {
      const newQa = await QaModel.create({
         category,
         question,
         answer,
         status
      });

      res.status(201).json(
         formatApiResponse(true, 'Qa created successfully', {
            newQa
         })
      );
   } catch (error) {
      console.error('Error creating Qa:', error);
      next(error);
   }
};

// Update Qa by ID
exports.updateQa = async (req, res, next) => {
   const { id } = req.params;
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { category, question, answer, status } = req.body;

   try {
      const updatedQa = await QaModel.findByIdAndUpdate(
         id,
         { category, question, answer, status },
         { new: true }
      );

      if (!updatedQa) {
         return res.status(404).json(formatApiResponse(false, 'Qa not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Qa updated successfully', {
            updatedQa
         })
      );
   } catch (error) {
      console.error('Error updating Qa:', error);
      next(error);
   }
};

// Delete Qa by ID
exports.deleteQa = async (req, res, next) => {
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
      const deletedQa = await QaModel.findByIdAndDelete(id);

      if (!deletedQa) {
         return res.status(404).json(formatApiResponse(false, 'Qa not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Qa deleted successfully', {
            deletedQa
         })
      );
   } catch (error) {
      console.error('Error deleting Qa:', error);
      next(error);
   }
};

// Delete all Qas
exports.deleteAllQas = async (req, res, next) => {
   try {
      // Remove all documents from the Qa collection
      const result = await QaModel.deleteMany();

      res.status(200).json(
         formatApiResponse(true, 'All Qas deleted successfully', {
            deletedCount: result.deletedCount
         })
      );
   } catch (error) {
      console.error('Error deleting all Qas:', error);
      next(error);
   }
};
