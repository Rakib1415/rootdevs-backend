const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const PrayerModel = require('../../models/Prayer');
const formatApiResponse = require('../../helpers/formatApiResponse');
const {
   paginate,
   getTransformedItems,
   getPagination,
   find
} = require('../../helpers/operations');
const { findAllItems, countTotalItems } = require('../../services/prayer');
const defaults = require('../../config/defaults');

// Get all prayers
exports.getAllPrayers = async (req, res, next) => {
   try {
      // const page = +req.query.page || defaults.page;
      // const limit = +req.query.limit || defaults.limit;
      // const sortType = req.query.sort_type || defaults.sortType;
      // const sortBy = req.query.sort_by || defaults.sortBy;
      // const search = req.query.search || defaults.search;

      // const { prayers, totalItems } = await findAllItems({
      //    page,
      //    limit,
      //    sortType,
      //    sortBy,
      //    search,
      //    model: PrayerModel
      // });

      // const transformedPrayers = getTransformedItems({
      //    items: prayers,
      //    selection: ['id', 'title']
      // });

      // const pagination = getPagination({ page, limit, totalItems });
      const data = await find({
         model: PrayerModel,
         queries: {
            page: req.query.page,
            populate: {
               path: 'user'
            },
            ...req.query
         }
      });
      console.log(data);

      res.status(200).json(
         formatApiResponse(true, 'Prayers retrieved successfully', data)
      );
   } catch (error) {
      console.error('Error getting all prayers:', error);
      next(error);
   }
};

// Get prayer by ID
exports.getPrayerById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const prayer = await PrayerModel.findById(id).populate({
         path: 'user',
         select: {
            password: 0,
            verifyCode: 0,
            forgetCode: 0,
            otpExpires: 0,
            emailVerified: 0
         }
      });

      if (!prayer) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Prayer not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Prayer retrieved successfully', {
            prayer
         })
      );
   } catch (error) {
      console.error('Error getting prayer by ID:', error);
      next(error);
   }
};

// Create a new prayer
exports.createPrayer = async (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { email, title, description } = req.body;

   try {
      const decoded = jwt.verify(
         req.cookies?.jwt,
         process.env.JWT_SECRET_ACCESS
      );

      const newPrayer = await PrayerModel.create({
         email,
         title,
         description,
         user: decoded?.userId
      });

      res.status(201).json(
         formatApiResponse(true, 'Prayer created successfully', {
            newPrayer
         })
      );
   } catch (error) {
      console.error('Error creating Prayer:', error);
      next(error);
   }
};

// Update prayer by ID
exports.updatePrayer = async (req, res, next) => {
   const { id } = req.params;
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const { email, title, description } = req.body;

   try {
      const updatedPrayer = await PrayerModel.findByIdAndUpdate(
         id,
         {
            email,
            title,
            description
         },
         { new: true }
      ).populate({
         path: 'user',
         select: {
            password: 0,
            verifyCode: 0,
            forgetCode: 0,
            otpExpires: 0,
            emailVerified: 0
         }
      });

      if (!updatedPrayer) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Prayer not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Prayer updated successfully', {
            updatedPrayer
         })
      );
   } catch (error) {
      console.error('Error updating prayer:', error);
      next(error);
   }
};

// Delete prayer by ID
exports.deletePrayer = async (req, res, next) => {
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
      const deletedPrayer = await PrayerModel.findByIdAndDelete(id).populate({
         path: 'user',
         select: {
            password: 0,
            verifyCode: 0,
            forgetCode: 0,
            otpExpires: 0,
            emailVerified: 0
         }
      });

      if (!deletedPrayer) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Prayer not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Prayer deleted successfully', {
            deletedPrayer
         })
      );
   } catch (error) {
      console.error('Error deleting prayer:', error);
      next(error);
   }
};

// Delete all paryers
exports.deleteAllPrayers = async (req, res, next) => {
   try {
      // Remove all documents from the Prayer collection
      const result = await PrayerModel.deleteMany();

      res.status(200).json(
         formatApiResponse(true, 'All prayers deleted successfully', {
            deletedCount: result.deletedCount
         })
      );
   } catch (error) {
      console.error('Error deleting all prayers:', error);
      next(error);
   }
};
