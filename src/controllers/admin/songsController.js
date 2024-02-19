const { validationResult } = require('express-validator');
const SongsModel = require('../../models/Songs');
const formatApiResponse = require('../../helpers/formatApiResponse');

// Get all Songs
exports.getAllSongs = async (req, res, next) => {
   try {
      const songs = await SongsModel.find();
      res.status(200).json(
         formatApiResponse(true, 'Songs retrieved successfully', {
            songs
         })
      );
   } catch (error) {
      console.error('Error getting all Songs:', error);
      next(error);
   }
};

// Get Song by ID
exports.getSongById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const song = await SongsModel.findById(id);
      if (!song) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Song not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Song retrieved successfully', {
            song
         })
      );
   } catch (error) {
      console.error('Error getting Song by ID:', error);
      next(error);
   }
};

// Create a new Song
exports.createSong = async (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { book_name, song_title, lyrics, status } = req.body;

   try {
      const newSong = await SongsModel.create({
         book_name,
         song_title,
         lyrics,
         status
      });

      res.status(201).json(
         formatApiResponse(true, 'Song created successfully', {
            newSong
         })
      );
   } catch (error) {
      console.error('Error creating Song:', error);
      next(error);
   }
};

// Update Song by ID
exports.updateSong = async (req, res, next) => {
   const { id } = req.params;
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { book_name, song_title, lyrics, status } = req.body;

   try {
      const updatedSong = await SongsModel.findByIdAndUpdate(
         id,
         { book_name, song_title, lyrics, status },
         { new: true }
      );

      if (!updatedSong) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Song not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Song updated successfully', {
            updatedSong
         })
      );
   } catch (error) {
      console.error('Error updating Song:', error);
      next(error);
   }
};

// Delete Song by ID
exports.deleteSong = async (req, res, next) => {
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
      const deletedSong = await SongsModel.findByIdAndDelete(id);

      if (!deletedSong) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Song not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Song deleted successfully', {
            deletedSong
         })
      );
   } catch (error) {
      console.error('Error deleting Song:', error);
      next(error);
   }
};

// Delete all Songs
exports.deleteAllSongs = async (req, res, next) => {
   try {
      // Remove all documents from the Songs collection
      const result = await SongsModel.deleteMany();

      res.status(200).json(
         formatApiResponse(true, 'All Songs deleted successfully', {
            deletedCount: result.deletedCount
         })
      );
   } catch (error) {
      console.error('Error deleting all Songs:', error);
      next(error);
   }
};
