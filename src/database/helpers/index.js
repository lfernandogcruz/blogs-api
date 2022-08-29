const jwt = require('jsonwebtoken');
const models = require('../models');

const { JWT_SECRET } = process.env;

const helpers = {
  tokenGen: (email, password) => {
    const token = jwt.sign({ email, password }, JWT_SECRET, { expiresIn: '1d' });
    return token;
  },
  tokenAuth: async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Token not found' });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await models.User.findOne({ where: { email: decoded.email } });
      if (!user) {
        return res.status(401).json({ message: 'Expired or invalid token' });
      }
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Expired or invalid token' });
    }
  },
};

module.exports = helpers;
