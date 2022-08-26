const model = require('../models');

const services = {
  userLogin: async ({ email, password }) => {
    const user = await model.User.findOne({ where: { email } });
    console.log('service user login - ', user);
    console.log('passwrd ', password);
  },
};

module.exports = services;