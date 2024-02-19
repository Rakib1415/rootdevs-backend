const { validationResult } = require('express-validator');
const DictionaryModel = require('../../models/Dictionary');
const TagModel = require('../../models/Tag');
const formatApiResponse = require('../../helpers/formatApiResponse');
const ExampleModel = require('../../models/Example');

// Get all dictionary
exports.getAllDictionary = async (req, res, next) => {
   try {
      const dictionaries = await DictionaryModel.find()
         .populate({
            path: 'tags',
            populate: ['book', 'chapter', 'version', 'verse']
         })
         .populate({
            path: 'examples',
            populate: 'tags'
         });
      res.status(200).json(
         formatApiResponse(true, 'Dictionaries retrieved successfully', {
            dictionaries
         })
      );
   } catch (error) {
      console.error('Error getting all dictionaries:', error);
      next(error);
   }
};

// Get Dictionary by ID
exports.getDictionaryById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const dictionary = await DictionaryModel.findById(id)
         .populate({
            path: 'tags',
            populate: ['book', 'chapter', 'version', 'verse']
         })
         .populate({
            path: 'examples',
            populate: 'tags'
         });
      if (!dictionary) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Dictionary not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Dictionary retrieved successfully', {
            dictionary
         })
      );
   } catch (error) {
      console.error('Error getting Dictionary by ID:', error);
      next(error);
   }
};

// Create a new Dictionary
exports.createDictionary = async (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const {
      word,
      word_in_english,
      defination,
      tags,
      image,
      caption,
      examples,
      status
   } = req.body;

   try {
      const newExamples = examples.map(async example => {
         const newExample = new ExampleModel({
            tags: example
         });
         await newExample.save();
         return newExample?._id;
      });
      const examplePromise = Promise.all(newExamples);
      const exampleIds = await examplePromise;

      const newDictionary = await DictionaryModel.create({
         word,
         word_in_english,
         defination,
         tags,
         image,
         caption,
         examples: exampleIds,
         status
      });

      res.status(201).json(
         formatApiResponse(true, 'dictionary created successfully', {
            newDictionary
         })
      );
   } catch (error) {
      console.error('Error creating dictionary:', error);
      next(error);
   }
};

// Update dictionary by ID
exports.updateDictionary = async (req, res, next) => {
   const { id } = req.params;
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const {
      word,
      word_in_english,
      defination,
      tags,
      image,
      caption,
      examples,
      status
   } = req.body;

   try {
      const newExamples = examples.map(async example => {
         const newExample = new ExampleModel({
            tags: example
         });
         await newExample.save();
         return newExample?._id;
      });
      const examplePromise = Promise.all(newExamples);
      const exampleIds = await examplePromise;
      const updatedDictionary = await DictionaryModel.findByIdAndUpdate(
         id,
         {
            word,
            word_in_english,
            defination,
            tags,
            image,
            caption,
            examples: exampleIds,
            status
         },
         { new: true }
      )
         .populate({
            path: 'tags',
            populate: ['book', 'chapter', 'version', 'verse']
         })
         .populate({
            path: 'examples',
            populate: 'tags'
         });

      if (!updatedDictionary) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Dictionary not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Dictionary updated successfully', {
            updatedDictionary
         })
      );
   } catch (error) {
      console.error('Error updating dictionary:', error);
      next(error);
   }
};

// Delete dictionary by ID
exports.deleteDictionary = async (req, res, next) => {
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
      const deletedDictionary = await DictionaryModel.findByIdAndDelete(id)
         .populate({
            path: 'tags',
            populate: ['book', 'chapter', 'version', 'verse']
         })
         .populate({
            path: 'examples',
            populate: 'tags'
         });

      if (!deletedDictionary) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Dictionary not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Dictionary deleted successfully', {
            deletedDictionary
         })
      );
   } catch (error) {
      console.error('Error deleting dictionary:', error);
      next(error);
   }
};

// Delete all tags
exports.deleteAllDictionary = async (req, res, next) => {
   try {
      // Remove all documents from the Tag collection
      const result = await DictionaryModel.deleteMany();

      res.status(200).json(
         formatApiResponse(true, 'All dictionaries deleted successfully', {
            deletedCount: result.deletedCount
         })
      );
   } catch (error) {
      console.error('Error deleting all dictionaries:', error);
      next(error);
   }
};
