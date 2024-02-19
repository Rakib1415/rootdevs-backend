// Function to generate a random reset token
function generateResetToken(tokenLength = 32) {
   const characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
   let token = '';

   for (let i = 0; i < tokenLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
   }

   return token;
}

module.exports = { generateResetToken };
