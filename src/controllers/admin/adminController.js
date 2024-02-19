const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { generateJsonWebToken } = require('../../helpers/generateJsonWebToken');
const AdminModel = require('../../models/Admin');
const formatApiResponse = require('../../helpers/formatApiResponse');
const { generateResetToken } = require('../../helpers/generateResetToken');
const {
   sendPasswordResetEmail
} = require('../../helpers/sendPasswordResetEmail');

// ********************** Registration ********************** //
exports.Registration = async (req, res, next) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(422).json(
            formatApiResponse(false, 'Validation failed', {
               errors: errors.array()
            })
         );
      }

      const { name, email, password, role, image, designation } = req.body;

      const userExists = await AdminModel.findOne({ email });

      if (userExists) {
         return res.status(422).json(
            formatApiResponse(false, 'User already exists', {
               error: 'User with the same email already exists. Please choose a different email.'
            })
         );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const refreshToken = generateJsonWebToken(
         { name, email },
         process.env.JWT_SECRET_REFRESH,
         '7d'
      );

      const adminModel = new AdminModel({
         name,
         email,
         password: hashedPassword,
         role,
         image,
         designation,
         refreshToken
      });

      const savedUser = await adminModel.save();

      const accessToken = generateJsonWebToken(
         { userId: savedUser._id, email: savedUser.email },
         process.env.JWT_SECRET_ACCESS,
         '1h'
      );

      // Res with http only cookie token
      res.cookie('jwt', refreshToken, {
         httpOnly: true,
         maxAge: 24 * 60 * 60 * 1000
      });
      res.json(
         formatApiResponse(true, 'User registered successfully', {
            user: {
               name: savedUser.name,
               email: savedUser.email,
               image: savedUser.image,
               role: savedUser.role
            },
            accessToken
         })
      );
   } catch (error) {
      console.error('Error saving user to MongoDB:', error);
      next(error);
   }
};

// ********************** Login ********************** //
exports.Login = async (req, res, next) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(422).json(
            formatApiResponse(false, 'Validation failed', {
               errors: errors.array()
            })
         );
      }

      const { email, password } = req.body;

      // Find the user
      const user = await AdminModel.findOne({ email });

      // user is not found or password is invalid
      if (!user || !(await bcrypt.compare(password, user.password))) {
         return res
            .status(401)
            .json(formatApiResponse(false, 'Invalid email or password'));
      }

      // (access token and refresh token)
      const accessToken = generateJsonWebToken(
         { userId: user._id, email: user.email },
         process.env.JWT_SECRET_ACCESS,
         '1h'
      );
      const refreshToken = generateJsonWebToken(
         { name: user.name, email: user.email },
         process.env.JWT_SECRET_REFRESH,
         '7d'
      );

      // Update the user document with the new refresh token
      await AdminModel.updateOne({ email }, { refreshToken });

      // Res with http only cookie token
      res.cookie('jwt', refreshToken, {
         httpOnly: true,
         maxAge: 24 * 60 * 60 * 1000
      });
      res.json(
         formatApiResponse(true, 'Login successful', {
            user: {
               name: user.name,
               email: user.email,
               image: user.image
            },
            accessToken
         })
      );
   } catch (error) {
      console.error('Error during login:', error);
      next(error);
   }
};

// ********************** Forgot Password ********************** //
exports.ForgotPassword = async (req, res, next) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(422).json(
            formatApiResponse(422, false, 'Validation error', {
               errors: errors.array()
            })
         );
      }

      const { email } = req.body;

      // Find the user by email
      const user = await AdminModel.findOne({ email });

      // user is not found
      if (!user) {
         return res
            .status(404)
            .json(formatApiResponse(404, false, 'User not found'));
      }

      // Generate a temporary token for password reset
      const resetToken = generateResetToken();

      // Save the token and its expiration time in the user model
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
      await user.save();

      // Send a password reset email to the user
      await sendPasswordResetEmail(user.email, resetToken);

      // For demonstration purposes, you can include the reset token in the API response
      res.json(
         formatApiResponse(true, 'Password reset initiated successfully', {
            resetToken
         })
      );
   } catch (error) {
      console.error('Error initiating password reset:', error);
      next(error);
   }
};

// ********************** Token Refresh ********************** //
exports.RefreshAccessToken = async (req, res, next) => {
   try {
      const cookies = req.cookies;

      if (!cookies?.jwt) {
         return res
            .status(401)
            .json(
               formatApiResponse(false, 'Unauthorized: Missing refresh token')
            );
      }

      const refreshToken = cookies.jwt;

      // Find the user
      const foundUser = await AdminModel.findOne({ refreshToken });

      // Check if it's a valid user
      if (!foundUser) {
         return res
            .status(403)
            .json(formatApiResponse(false, 'Forbidden access: User not found'));
      }

      // Verify the refresh token
      jwt.verify(
         refreshToken,
         process.env.JWT_SECRET_REFRESH,
         (err, decoded) => {
            if (err || foundUser.email !== decoded.email) {
               return res
                  .status(403)
                  .json(
                     formatApiResponse(
                        false,
                        'Forbidden access: Invalid refresh token'
                     )
                  );
            }

            // Extract userId and email from the decoded refresh token
            const { name, email } = decoded;

            // Generate a new access token
            const newAccessToken = generateJsonWebToken(
               { name, email },
               process.env.JWT_SECRET_ACCESS,
               '1h'
            );

            res.json(
               formatApiResponse(true, 'Refresh token sent successfully', {
                  accessToken: newAccessToken
               })
            );
         }
      );
   } catch (error) {
      console.error('Error refreshing access token:', error);
      next(error);
   }
};

// ********************** Get User Profile ********************** //
exports.GetUserProfile = async (req, res, next) => {
   const userId = req.params.id;

   try {
      // Find the user by ID
      const user = await AdminModel.findById(userId);

      // User not found
      if (!user) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'User not found'));
      }

      // Return user profile using formatApiResponse
      res.json(
         formatApiResponse(true, 'User profile retrieved successfully', {
            user: { name: user.name, email: user.email, image: user.image }
         })
      );
   } catch (error) {
      console.error('Error getting user profile:', error);
      next(error);
   }
};

// ********************** Update Profile ********************** //
exports.UpdateUser = async (req, res, next) => {
   // Express-validator
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }

   const userId = req.params.id;
   const { name, image } = req.body;

   try {
      // Find the user
      const user = await AdminModel.findById(userId);

      // user is not found
      if (!user) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'User not found'));
      }

      user.name = name || user.name;
      user.image = image || user.image;

      await user.save();

      // Return formatted response
      res.json(
         formatApiResponse(true, 'User profile updated successfully', {
            user: { name: user.name, email: user.email, image: user.image }
         })
      );
   } catch (error) {
      console.error('Error updating user:', error);
      next(error);
   }
};

// ********************** Change Password ********************** //
exports.ChangePassword = async (req, res, next) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(422).json(
            formatApiResponse(false, 'Validation error', {
               errors: errors.array()
            })
         );
      }

      const userId = req.params.id;
      const { password, newPassword } = req.body;

      // Find the user
      const user = await AdminModel.findById(userId);

      // user is not found
      if (!user) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'User not found'));
      }

      // Check if the new password is the same as the old password
      const isSamePassword = await bcrypt.compare(newPassword, user.password);

      if (isSamePassword) {
         return res
            .status(400)
            .json(
               formatApiResponse(
                  false,
                  'New password must be different from the old password'
               )
            );
      }

      // Compare old password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
         return res
            .status(401)
            .json(formatApiResponse(false, 'Invalid old password'));
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password
      user.password = hashedNewPassword;
      await user.save();

      // Generate a new access token
      const accessToken = generateJsonWebToken(
         { userId: user._id, email: user.email },
         process.env.JWT_SECRET_ACCESS,
         '1h'
      );

      // Return formatted response
      res.json(
         formatApiResponse(true, 'Password changed successfully', {
            accessToken,
            user: { name: user.name, email: user.email, image: user.image }
         })
      );
   } catch (error) {
      console.error('Error changing password:', error);
      next(error);
   }
};

// ********************** All Users ********************** //
exports.GetAllUsers = async (req, res, next) => {
   try {
      const users = await AdminModel.find({}, { password: 0, __v: 0 });

      res.json(
         formatApiResponse(true, 'Users retrieved successfully', { users })
      );
   } catch (error) {
      console.error('Error getting all users:', error);
      next(error);
   }
};

// ********************** Delete User ********************** //
exports.DeleteUser = async (req, res, next) => {
   // Express-validator
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).json(
         formatApiResponse(false, 'Validation error', {
            errors: errors.array()
         })
      );
   }
   const { email, password } = req.body;

   try {
      // Find the user
      const user = await AdminModel.findOne({ email });

      // user is not found
      if (!user) {
         return res
            .status(404)
            .json(formatApiResponse(false, 'User not found'));
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
         return res
            .status(401)
            .json(formatApiResponse(false, 'Invalid password'));
      }

      // Delete user
      await AdminModel.findByIdAndDelete(user._id);

      // Return formatted response
      res.json(formatApiResponse(true, 'User deleted successfully'));
   } catch (error) {
      console.error('Error deleting user:', error);
      next(error);
   }
};
