const model = require('../models');
const services = require('../services');

const middlewares = {
  loginEmptyFieldsValidation: (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Some required fields are missing' });
    }
    next();
  },
  loginValidation: async (req, res, next) => {
    const { email, password } = req.body;
    const userInfo = await services.userLogin({ email });
    if (!userInfo || userInfo.password !== password) {
      return res.status(400).json({ message: 'Invalid fields' });
    }
    next();
  },
  validateEmail: (req, res, next) => {
    const { email } = req.body;
    const validateEmailInputRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isplayerEmailValid = validateEmailInputRegex.test(email);
    if (!isplayerEmailValid) {
      return res.status(400).json({ message: '"email" must be a valid email' });
    }
    next();
  },
  validateDisplayName: (req, res, next) => {
    const { displayName } = req.body;
    if (displayName.length < 8) {
      return res.status(400).json({
        message: '"displayName" length must be at least 8 characters long' });
    }
    next();
  },
  validatePassword: (req, res, next) => {
    const { password } = req.body;
    if (password.length < 6) {
      return res.status(400).json({
        message: '"password" length must be at least 6 characters long' });
    }
    next();
  },
  validateUniqueEmail: async (req, res, next) => {
    const { email } = req.body;
    const userInfo = await model.User.findOne({
      attributes: ['email'],
      where: { email },
      raw: true,
    });
    if (userInfo || userInfo !== null) {
      return res.status(409).json({ message: 'User already registered' });
    }
    next();
  },
  validateCatNameNotEmpty: async (req, res, next) => {
    const { name } = req.body;
    if (!name || name === undefined) {
      return res.status(400).json({ message: '"name" is required' });
    }
    next();
  },
  // tokenValidation: async (req, res, next) => {
  //   const { authorization: { token } } = req.header;
  //   console.log('>>> AUTHORIZATION --- ', token);
  //   // const result = 
  //   if (!token || token === undefined) {
  //     return res.status(401).json({ message: 'Token not found' });
  //   }
  //   next();
  // },
};

module.exports = middlewares;