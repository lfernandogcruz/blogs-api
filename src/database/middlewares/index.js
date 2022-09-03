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
        message: '"displayName" length must be at least 8 characters long',
      });
    }
    next();
  },
  validatePassword: (req, res, next) => {
    const { password } = req.body;
    if (password.length < 6) {
      return res.status(400).json({
        message: '"password" length must be at least 6 characters long',
      });
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
  validatePostFieldsNotEmpty: async (req, res, next) => {
    const { title, content, categoryIds } = req.body;
    if (!title || !content || !categoryIds || categoryIds.length === 0) {
      return res.status(400).json({ message: 'Some required fields are missing' });
    }
    next();
  },
  validateExistingCategories: async (req, res, next) => {
    const { categoryIds } = req.body;
    const catList = await Promise.all(
      categoryIds.map((cat) => model.Category.findByPk(cat)),
    );
    const isValid = catList.some((cat) => cat !== null);
    if (!isValid) return res.status(400).json({ message: '"categoryIds" not found' });
    next();
  },
  validateExistingPostAndUserOwnership: async (req, res, next) => {
    const { id } = req.params;
    const { id: userId } = req.user;
    const postExists = await model.BlogPost.findByPk(id);
    if (!postExists) return res.status(404).json({ message: 'Post does not exist' });
    if (postExists.userId !== userId) return res.status(401).json({ message: 'Unauthorized user' });
    next();
  },
  validateFieldsFilledForUpdating: async (req, res, next) => {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Some required fields are missing' });
    }
    next();
  },
};

module.exports = middlewares;
