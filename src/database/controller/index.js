const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const controllers = {
  userLogin: (req, res) => {
    const { email } = req.body;
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });
    return res.status(200).json({ token });
  },
};

module.exports = controllers;
