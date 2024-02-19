const { validationResult } = require('express-validator');
const PosterModel = require('../../models/Poster');
const formatApiResponse = require('../../helpers/formatApiResponse');

// Get all Posters
exports.getAllPosters = async (req, res, next) => {
   try {
      const posters = await PosterModel.find();
      res.status(200).json(
         formatApiResponse(true, 'Posters retrieved successfully', {
            posters
         })
      );
   } catch (error) {
      console.error('Error getting all posters:', error);
      next(error);
   }
};

// Get Poster by ID
exports.getPosterById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const poster = await PosterModel.findById(id);
      if (!poster) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Poster not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Poster retrieved successfully', {
            poster
         })
      );
   } catch (error) {
      console.error('Error getting poster by ID:', error);
      next(error);
   }
};

// Create a new Poster
exports.createPoster = async (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { poster_category, title, image, description, status } = req.body;

   try {
      const newPoster = await PosterModel.create({
         poster_category,
         title,
         image,
         description,
         status
      });

      res.status(201).json(
         formatApiResponse(true, 'Poster created successfully', {
            newPoster
         })
      );
   } catch (error) {
      console.error('Error creating poster:', error);
      next(error);
   }
};

// Update Poster by ID
exports.updatePoster = async (req, res, next) => {
   const { id } = req.params;
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { poster_category, title, image, description, status } = req.body;

   try {
      const updatedPoster = await PosterModel.findByIdAndUpdate(
         id,
         { poster_category, title, image, description, status },
         { new: true }
      );

      if (!updatedPoster) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Poster not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Poster updated successfully', {
            updatedPoster
         })
      );
   } catch (error) {
      console.error('Error updating poster:', error);
      next(error);
   }
};

// Delete Poster by ID
exports.deletePoster = async (req, res, next) => {
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
      const deletedPoster = await PosterModel.findByIdAndDelete(id);

      if (!deletedPoster) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Poster not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Poster deleted successfully', {
            deletedPoster
         })
      );
   } catch (error) {
      console.error('Error deleting poster:', error);
      next(error);
   }
};

// Delete all Posters
exports.deleteAllPosters = async (req, res, next) => {
   try {
      // Remove all documents from the Poster collection
      const result = await PosterModel.deleteMany();

      res.status(200).json(
         formatApiResponse(true, 'All posters deleted successfully', {
            deletedCount: result.deletedCount
         })
      );
   } catch (error) {
      console.error('Error deleting all posters:', error);
      next(error);
   }
};
