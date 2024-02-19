const { validationResult } = require('express-validator');
const BookModel = require('../../models/Book');
const formatApiResponse = require('../../helpers/formatApiResponse');

// Get all books
exports.getAllBooks = async (req, res, next) => {
   try {
      const books = await BookModel.find()
         .populate('language')
         .populate('version');
      res.status(200).json(
         formatApiResponse(true, 'Books retrieved successfully', {
            books
         })
      );
   } catch (error) {
      console.error('Error getting all books:', error);
      next(error);
   }
};

// Get book by ID
exports.getBookById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const book = await BookModel.findById(id)
         .populate('language')
         .populate('version');
      if (!book) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Book not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Book retrieved successfully', {
            book
         })
      );
   } catch (error) {
      console.error('Error getting book by ID:', error);
      next(error);
   }
};

// Create a new book
exports.createBook = async (req, res, next) => {
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
      version,
      collection_code,
      book_id,
      book_name,
      english_name,
      book_order,
      number_of_chapters,
      chapters,
      status
   } = req.body;

   try {
      const newBook = await BookModel.create({
         language,
         version,
         collection_code,
         book_id,
         book_name,
         english_name,
         book_order,
         number_of_chapters,
         chapters,
         status
      });

      res.status(201).json(
         formatApiResponse(true, 'Book created successfully', {
            newBook
         })
      );
   } catch (error) {
      console.error('Error creating book:', error);
      next(error);
   }
};

// Update book by ID
exports.updateBook = async (req, res, next) => {
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
      language,
      version,
      collection_code,
      book_id,
      book_name,
      english_name,
      book_order,
      number_of_chapters,
      chapters,
      status
   } = req.body;

   try {
      const updatedBook = await BookModel.findByIdAndUpdate(
         id,
         {
            language,
            version,
            collection_code,
            book_id,
            book_name,
            english_name,
            book_order,
            number_of_chapters,
            chapters,
            status
         },
         { new: true }
      )
         .populate('language')
         .populate('version');

      if (!updatedBook) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Book not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Book updated successfully', {
            updatedBook
         })
      );
   } catch (error) {
      console.error('Error updating book:', error);
      next(error);
   }
};

// Delete book by ID
exports.deleteBook = async (req, res, next) => {
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
      const deletedBook = await BookModel.findByIdAndDelete(id)
         .populate('language')
         .populate('version');

      if (!deletedBook) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'Book not found'));
      }

      res.status(200).json(
         formatApiResponse(true, 'Book deleted successfully', {
            deletedBook
         })
      );
   } catch (error) {
      console.error('Error deleting book:', error);
      next(error);
   }
};

// Delete all books
exports.deleteAllBooks = async (req, res, next) => {
   try {
      // Remove all documents from the Book collection
      const result = await BookModel.deleteMany();

      res.status(200).json(
         formatApiResponse(true, 'All books deleted successfully', {
            deletedCount: result.deletedCount
         })
      );
   } catch (error) {
      console.error('Error deleting all books:', error);
      next(error);
   }
};
