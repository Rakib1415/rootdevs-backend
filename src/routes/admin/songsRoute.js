const express = require('express');
const { body, param } = require('express-validator');
const {
   getAllSongs,
   getSongById,
   createSong,
   updateSong,
   deleteSong,
   deleteAllSongs
} = require('../../controllers/admin/songsController'); // Update the controller import

const router = express.Router();

// Validation middleware
const bookNameValidation = body('book_name').notEmpty().withMessage('Book Name is required');
const songTitleValidation = body('song_title').notEmpty().withMessage('Song Title is required');
const lyricsValidation = body('lyrics').notEmpty().withMessage('Lyrics is required');
const statusValidation = body('status')
   .notEmpty()
   .withMessage('Status is required')
   .isIn(['0', '1'])
   .withMessage('Invalid status value');
const idValidation = param('id').isMongoId().withMessage('Invalid ID format');

// Create Songs Route Validation
const createSongValidation = [bookNameValidation, songTitleValidation, lyricsValidation, statusValidation];

// Update Songs Route Validation
const updateSongValidation = [idValidation, bookNameValidation, songTitleValidation, lyricsValidation, statusValidation];

// Delete Songs Route Validation
const deleteSongValidation = [idValidation];

router.get('/all', getAllSongs);
router.get('/:id', getSongById);
router.post('/create', createSongValidation, createSong);
router.put('/update/:id', updateSongValidation, updateSong);
router.delete('/delete/:id', deleteSongValidation, deleteSong);
router.delete('/delete-all', deleteAllSongs);

module.exports = router;
