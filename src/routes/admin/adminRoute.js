const express = require('express');
const { body } = require('express-validator');
const {
   ChangePassword,
   DeleteUser,
   GetAllUsers,
   GetUserProfile,
   Login,
   RefreshAccessToken,
   Registration,
   UpdateUser,
   ForgotPassword
} = require('../../controllers/admin/adminController');

const router = express.Router();

// Common validation middleware
const emailValidation = body('email')
   .isEmail()
   .withMessage('Invalid email format');
const passwordValidation = body('password')
   .notEmpty()
   .withMessage('Password is required');
const nameValidation = body('name').notEmpty().withMessage('Name is required');
const imageValidation = body('image')
   .optional()
   .isURL()
   .withMessage('Invalid image URL format');
const designationValidation = body('designation')
   .optional()
   .notEmpty()
   .withMessage('Designation is required');
const newPasswordValidation = body('newPassword')
   .isLength({ min: 6 })
   .withMessage('New password must be at least 6 characters long');

// Create User Route Validation
const createUserValidation = [
   nameValidation,
   emailValidation,
   passwordValidation
];

// login Route Validation
const loginValidation = [emailValidation, passwordValidation];

// Update User Route Validation
const updateUserValidation = [
   nameValidation,
   imageValidation,
   designationValidation
];

// Change Password Route Validation
const changePasswordValidation = [passwordValidation, newPasswordValidation];

// Delete User Route Validation
const deleteUserValidation = [emailValidation, passwordValidation];

router.post('/register', createUserValidation, Registration);
router.post('/login', loginValidation, Login);
router.post('/refresh-token', RefreshAccessToken);
router.post('/change-password/:id', changePasswordValidation, ChangePassword);
router.post('/forget-password', emailValidation, ForgotPassword);
router.get('/all', GetAllUsers);
router.get('/:id', GetUserProfile);
router.put('/update/:id', updateUserValidation, UpdateUser);
router.delete('/delete', deleteUserValidation, DeleteUser);

module.exports = router;
