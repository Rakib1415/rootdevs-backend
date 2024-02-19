const nodemailer = require('nodemailer');

// Configure the Nodemailer transporter
const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: 'anisseam238@gmail.com',
      pass: 'guliqxogblxvhqyj'
   }
});

// Function to send a password reset email
async function sendPasswordResetEmail(email, otp) {
   // Define the email options with HTML body
   const mailOptions = {
      from: 'anisseam238@gmail.com', // Sender email address
      to: email, // Recipient email address
      subject: 'Password Reset', // Email subject
      html: `
         <p>Dear User,</p>
         <p>We received a request to reset your password. Please use the following one-time code to proceed:</p>
         <p style="font-size: 24px; font-weight: bold;">${otp}</p>
         <p>If you didn't initiate this request, you can safely ignore this email.</p>
         <p>Best regards,<br>Your Application Team</p>
      `
   };

   // Send the email
   await transporter.sendMail(mailOptions);
}

module.exports = { sendPasswordResetEmail };
