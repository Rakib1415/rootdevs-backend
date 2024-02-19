const mongoose = require('mongoose');

const connectToDatabase = () => {
   try {
      let dbUri;

      if (process.env.NODE_ENV === 'production') {
         // Use production MongoDB URI
         dbUri = process.env.MONGODB_URI_PROD || 'not-found';
      } else if (process.env.NODE_ENV === 'development') {
         // Use development MongoDB URI
         dbUri = process.env.MONGODB_URI_DEV || 'not-found';
      } else {
         console.log(
            'Invalid NODE_ENV. Please set it to "production" or "development".'
         );
         return;
      }

      if (dbUri === 'not-found') {
         console.log(
            'Database URL not found. Please provide a valid MongoDB URI.'
         );
         return;
      }

      mongoose.connect(dbUri);

      const db = mongoose.connection;

      db.on('error', console.error.bind(console, 'MongoDB connection error:'));
      db.once('open', () => {
         console.log('Success: Connected to MongoDB');
      });
   } catch (error) {
      console.error('Error connecting to MongoDB:', error);
   }
};

module.exports = connectToDatabase;
