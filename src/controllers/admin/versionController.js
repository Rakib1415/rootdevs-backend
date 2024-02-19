const { validationResult } = require('express-validator');
const VersionModel = require('../../models/Version');
const formatApiResponse = require('../../helpers/formatApiResponse');

// Get all versions
exports.getAllVersions = async (req, res, next) => {
   try {
      const versions = await VersionModel.find().populate('language');
      res.status(200).json(
         formatApiResponse(true, 'Versions retrieved successfully', {
            versions
         })
      );
   } catch (error) {
      console.error('Error getting all versions:', error);
      next(error);
   }
};

// Get version by code
exports.getVersionByCode = async (req, res, next) => {
   const { code } = req.params;

   try {
      const version = await VersionModel.findOne({
         version_code: code
      }).populate('language');
      if (!version) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Version not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Version retrieved successfully', {
            version
         })
      );
   } catch (error) {
      console.error('Error getting version by code:', error);
      next(error);
   }
};

// Create a new version
exports.createVersion = async (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const {
      language,
      version_code,
      english_name,
      volume_name,
      collection_code,
      media,
      media_type,
      copyright_text,
      copyright_link,
      status
   } = req.body;

   try {
      const newVersion = await VersionModel.create({
         language,
         version_code,
         english_name,
         volume_name,
         collection_code,
         media,
         media_type,
         copyright_text,
         copyright_link,
         status
      });

      res.status(201).json(
         formatApiResponse(true, 'Version created successfully', {
            newVersion
         })
      );
   } catch (error) {
      console.error('Error creating version:', error);
      next(error);
   }
};

// Update version by code
exports.updateVersion = async (req, res, next) => {
   const { code } = req.params;
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const {
      language,
      version_code,
      english_name,
      volume_name,
      collection_code,
      media,
      media_type,
      copyright_text,
      copyright_link,
      status
   } = req.body;

   try {
      const updatedVersion = await VersionModel.findOneAndUpdate(
         { version_code: code },
         {
            language,
            version_code,
            english_name,
            volume_name,
            collection_code,
            media,
            media_type,
            copyright_text,
            copyright_link,
            status
         },
         { new: true }
      ).populate('language');

      if (!updatedVersion) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Version not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Version updated successfully', {
            updatedVersion
         })
      );
   } catch (error) {
      console.error('Error updating version:', error);
      next(error);
   }
};

// Delete version by code
exports.deleteVersion = async (req, res, next) => {
   const { code } = req.params;
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   try {
      const deletedVersion = await VersionModel.findOneAndDelete({
         version_code: code
      }).populate('language');

      if (!deletedVersion) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Version not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Version deleted successfully', {
            deletedVersion
         })
      );
   } catch (error) {
      console.error('Error deleting version:', error);
      next(error);
   }
};

// Delete all versions
exports.deleteAllVersions = async (req, res, next) => {
   try {
      // Remove all documents from the Version collection
      const result = await VersionModel.deleteMany();

      res.status(200).json(
         formatApiResponse(true, 'All versions deleted successfully', {
            deletedCount: result.deletedCount
         })
      );
   } catch (error) {
      console.error('Error deleting all versions:', error);
      next(error);
   }
};
