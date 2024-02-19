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
   ForgotPassword,
   ResetPassword,
   VerifyOTP
} = require('../../controllers/mobile/userController');

const router = express.Router();

// Common validation middleware
const emailValidation = body('email')
   .isEmail()
   .withMessage('Invalid email format');
const passwordValidation = body('password')
   .notEmpty()
   .withMessage('Password is required');

const otpValidation = body('otp').notEmpty().withMessage('OTP is required');
const tokenValidation = body('token')
   .notEmpty()
   .withMessage('Token is required');
const nameValidation = body('name').notEmpty().withMessage('Name is required');
const imageValidation = body('image')
   .optional()
   .isURL()
   .withMessage('Invalid image URL format');
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
const updateUserValidation = [nameValidation, imageValidation];

// Change Password Route Validation
const changePasswordValidation = [passwordValidation, newPasswordValidation];

// Delete User Route Validation
const deleteUserValidation = [emailValidation, passwordValidation];

// OTP route validation
const verifyOTPValidation = [otpValidation, tokenValidation];

// OTP route validation
const resetPasswordValidation = [emailValidation, newPasswordValidation];

router.post('/register', createUserValidation, Registration);
router.post('/login', loginValidation, Login);
router.post('/refresh-token', RefreshAccessToken);
router.post('/change-password/:id', changePasswordValidation, ChangePassword);
router.post('/forget-password', emailValidation, ForgotPassword);
router.post('/verify-otp', verifyOTPValidation, VerifyOTP);
router.post('/reset-password', resetPasswordValidation, ResetPassword);
router.get('/all', GetAllUsers);
router.get('/profile/:id', GetUserProfile);
router.put('/update/:id', updateUserValidation, UpdateUser);
router.delete('/delete', deleteUserValidation, DeleteUser);

module.exports = router;
