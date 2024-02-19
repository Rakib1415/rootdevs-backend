const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const apiKeyMiddleware = require('../middlewares/apiKeyMiddleware');

const configureApp = app => {
   // Helmet helps secure the app with various HTTP headers
   app.use(helmet());

   // morgan helps log of the each request
   app.use(morgan('dev'));

   // Determine allowed origins based on the environment
   const allowedOrigins =
      process.env.NODE_ENV === 'production'
         ? ['https://allowed-production-origin.com']
         : ['http://localhost:3000']; // Adjust the local development origin as needed

   // CORS options with allowed origins
   const corsOptions = {
      origin: allowedOrigins,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true // Enable credentials (e.g., cookies, authorization headers)
   };

   // Enable Cross-Origin Resource Sharing
   app.use(cors(corsOptions));
   // Parse URL-encoded bodies
   app.use(express.urlencoded({ extended: false }));

   // Parse JSON bodies with a limit of 1mb
   app.use(express.json());
   app.use(express.json({ limit: '1mb' }));

   // Parse cookies
   app.use(cookieParser());

   // Verify API key for all routes under '/api'
   app.use('/api', apiKeyMiddleware);
};

module.exports = configureApp;
