// src/app.ts
const dotenv = require('dotenv');
const express = require('express');
dotenv.config();

const configureApp = require('./config/config');
const connectToDatabase = require('./config/db');
const errorHandler = require('./config/errorHandler');
const createRoutes = require('./config/router');

const app = express();
const PORT = process.env.PORT || 5000;

// App Configuration and API_KEY middleware
configureApp(app);

// MongoDB connection
connectToDatabase();

// Main Route
createRoutes(app);

// App errorHandler
app.use(errorHandler);

app.listen(PORT, () => {
   console.log(`Backend server running on port ${PORT}`);
});
