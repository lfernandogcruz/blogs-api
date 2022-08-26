const model = require('../models');

const services = {
  userLogin: async ({ email }) => {
    const userInfo = await model.User.findOne({
      attributes: ['email', 'password'],
      where: { email },
      raw: true,
  });
  return userInfo;
  },
  create: async (obj) => {
    const newUser = await model.User.create(obj);
    return newUser.dataValues;
  },
};

module.exports = services;