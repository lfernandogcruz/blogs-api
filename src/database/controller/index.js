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
    const isCreated = await services.createUser(obj);
    if (!isCreated) return res.status(500).json({ message: 'Internal Error' });
    const token = helpers.tokenGen({ email, password });
    return res.status(201).json({ token });
  },
  findAllUser: async (req, res) => {
    const result = await services.findAllUser();
    if (result === undefined) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json(result);
  },
  findByIdUser: async (req, res) => {
    const { id } = req.params;
    const result = await services.findByIdUser(id);
    if (result === null || result === undefined) {
      return res.status(404).json({ message: 'User does not exist' });
    }
      return res.status(200).json(result);
  },
  createCategory: async (req, res) => {
    const name = req.body;
    const result = await services.createCategory(name);
    if (!result) return res.status(500).json({ message: 'Internal Error' });
    return res.status(201).json(result);
  },
};

module.exports = controllers;
