const jwt = require('jsonwebtoken');
const helpers = require('../helpers');
const services = require('../services');

const { JWT_SECRET } = process.env;

const controllers = {
  userLogin: (req, res) => {
    const { email } = req.body;
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });
    return res.status(200).json({ token });
  },
  createUser: async (req, res) => {
    const { displayName, email,
      password, image } = req.body;
    const obj = { displayName, email, password, image }; 
    const isCreated = await services.create(obj);
    if (!isCreated) return res.status(500).json({ message: 'Internal Error' });
    const token = helpers.tokenGen({ email, password });
    return res.status(201).json({ token });
  },
};

module.exports = controllers;
