const jwt = require('jsonwebtoken');

exports.generateJsonWebToken = (payload, secret, expiresIn) => {
   return jwt.sign(payload, secret, { expiresIn });
};
