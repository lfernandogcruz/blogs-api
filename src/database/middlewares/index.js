const model = require('../models');

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
    const userInfo = await model.User.findOne({
        attributes: ['email', 'password'],
        where: { email },
        raw: true,
    });
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
  tokenValidation: async (req, res, next) => {
    const { authorization } = req.header;
    const result = console.log(authorization);
    if (!result) return res.status(401).json({ message: 'deu ruim' });
    next();
  },
};

module.exports = middlewares;

// Requisições que precisam de token mas não o receberam devem
// retornar um código de status 401;

// Requisições que não seguem o formato pedido pelo servidor
// devem retornar um código de status 400;

// Um problema inesperado no servidor deve
// retornar um código de status 500;

// Um acesso ao criar um recurso, no nosso caso usuário ou post,
// deve retornar um código de status 201.
