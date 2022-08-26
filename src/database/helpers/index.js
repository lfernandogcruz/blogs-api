const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const helpers = {
  tokenGen: (email, password) => {
    const token = jwt.sign(
      { email, password },
      JWT_SECRET,
      { expiresIn: '1d' },
      );
    return token;
  },
};

module.exports = helpers;