// src/middlewares/verifyAuthJWT.js

const jwt = require('jsonwebtoken');

const verifyAuthJWT = (req, res, next) => {
   const authHeader = req.headers['authorization'];

   if (!authHeader) return res.sendStatus(401);

   const token = authHeader.split(' ')[1];

   jwt.verify(
      token,
      process.env.JWT_SECRET_ACCESS, // Assuming JWT_SECRET_ACCESS is a string
      (err, decoded) => {
         if (err) return res.sendStatus(403);

         // Assuming 'name' is a property in your JWT payload
         req.user = decoded.name;

         next();
      }
   );
};

module.exports = verifyAuthJWT;
