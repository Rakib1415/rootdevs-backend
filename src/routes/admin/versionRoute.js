const express = require('express');
const { body, param } = require('express-validator');
const {
   getAllVersions,
   getVersionByCode,
   createVersion,
   updateVersion,
   deleteVersion,
   deleteAllVersions
} = require('../../controllers/admin/versionController'); // Update the controller import
const VersionModel = require('../../models/Version');

const router = express.Router();

// Validation middleware
const codeValidation = body('version_code')
   .notEmpty()
   .withMessage('Version code is required')
   .custom(async value => {
      // Check if the version_code is unique
      const existingVersion = await VersionModel.findOne({
         version_code: value
      });
      if (existingVersion) {
         return Promise.reject('Version code must be unique');
      }
   });

const languageValidation = body('language')
   .notEmpty()
   .withMessage('Language is required')
   .isMongoId()
   .withMessage('Invalid language ID');

const nameValidation = body('english_name')
   .notEmpty()
   .withMessage('English name is required');
const volumeValidation = body('volume_name')
   .notEmpty()
   .withMessage('Volume name is required');
const collectionValidation = body('collection_code')
   .notEmpty()
   .withMessage('Collection code is required')
   .isIn(['OT', 'NT', 'Both'])
   .withMessage('Invalid collection code value');
const mediaValidation = body('media')
   .notEmpty()
   .withMessage('Media is required')
   .isIn(['Text', 'Audio', 'Both'])
   .withMessage('Invalid media value');
const mediaTypeValidation = body('media_type')
   .notEmpty()
   .withMessage('Media type is required')
   .isIn(['Drama', 'Non-Drama', 'N/A'])
   .withMessage('Invalid media type value');
const copyrightTextValidation = body('copyright_text').optional();
const copyrightLinkValidation = body('copyright_link').optional();
const statusValidation = body('status')
   .notEmpty()
   .withMessage('Status is required')
   .isIn(['0', '1'])
   .withMessage('Invalid status value');
const codeParamValidation = param('code')
   .notEmpty()
   .withMessage('Version code parameter is required');

// Create Version Route Validation
const createVersionValidation = [
   codeValidation,
   languageValidation,
   nameValidation,
   volumeValidation,
   collectionValidation,
   mediaValidation,
   mediaTypeValidation,
   copyrightTextValidation,
   copyrightLinkValidation,
   statusValidation
];

const updateVersionValidation = [
   codeParamValidation,
   languageValidation,
   nameValidation,
   volumeValidation,
   collectionValidation,
   mediaValidation,
   mediaTypeValidation,
   copyrightTextValidation,
   copyrightLinkValidation,
   statusValidation
];

// Delete Version Route Validation
const deleteVersionValidation = [codeParamValidation];

router.get('/all', getAllVersions);
router.get('/:code', getVersionByCode);
router.post('/create', createVersionValidation, createVersion);
router.put('/update/:code', updateVersionValidation, updateVersion);
router.delete('/delete/:code', deleteVersionValidation, deleteVersion);
router.delete('/delete-all', deleteAllVersions);

module.exports = router;
