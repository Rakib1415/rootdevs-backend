const { validationResult } = require('express-validator');
const SongBookModel = require('../../models/SongBook');
const formatApiResponse = require('../../helpers/formatApiResponse');

// Get all SongBooks
exports.getAllSongBooks = async (req, res, next) => {
   try {
      const songBooks = await SongBookModel.find();
      res.status(200).json(
         formatApiResponse(true, 'SongBooks retrieved successfully', {
            songBooks
         })
      );
   } catch (error) {
      console.error('Error getting all SongBooks:', error);
      next(error);
   }
};

// Get SongBook by ID
exports.getSongBookById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const songBook = await SongBookModel.findById(id);
      if (!songBook) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'SongBook not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'SongBook retrieved successfully', {
            songBook
         })
      );
   } catch (error) {
      console.error('Error getting SongBook by ID:', error);
      next(error);
   }
};

// Create a new SongBook
exports.createSongBook = async (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { name, image, status } = req.body;

   try {
      const newSongBook = await SongBookModel.create({
         name,
         image,
         status
      });

      res.status(201).json(
         formatApiResponse(true, 'SongBook created successfully', {
            newSongBook
         })
      );
   } catch (error) {
      console.error('Error creating SongBook:', error);
      next(error);
   }
};

// Update SongBook by ID
exports.updateSongBook = async (req, res, next) => {
   const { id } = req.params;
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { name, image, status } = req.body;

   try {
      const updatedSongBook = await SongBookModel.findByIdAndUpdate(
         id,
         { name, image, status },
         { new: true }
      );

      if (!updatedSongBook) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'SongBook not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'SongBook updated successfully', {
            updatedSongBook
         })
      );
   } catch (error) {
      console.error('Error updating SongBook:', error);
      next(error);
   }
};

// Delete SongBook by ID
exports.deleteSongBook = async (req, res, next) => {
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
      const deletedSongBook = await SongBookModel.findByIdAndDelete(id);

      if (!deletedSongBook) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'SongBook not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'SongBook deleted successfully', {
            deletedSongBook
         })
      );
   } catch (error) {
      console.error('Error deleting SongBook:', error);
      next(error);
   }
};

// Delete all SongBooks
exports.deleteAllSongBooks = async (req, res, next) => {
   try {
      // Remove all documents from the SongBook collection
      const result = await SongBookModel.deleteMany();

      res.status(200).json(
         formatApiResponse(true, 'All SongBooks deleted successfully', {
            deletedCount: result.deletedCount
         })
      );
   } catch (error) {
      console.error('Error deleting all SongBooks:', error);
      next(error);
   }
};
