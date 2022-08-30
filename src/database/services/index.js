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
  createUser: async (obj) => {
    const newUser = await model.User.create(obj);
    return newUser.dataValues;
  },
  findAllUser: async () => {
    const result = await model.User.findAll({ attributes: { exclude: ['password'] } });
    const mapped = result.map((user) => user.dataValues);
    return mapped;
  },
  findByIdUser: async (id) => {
    const result = await model.User.findByPk(
      id,
      { attributes: { exclude: ['password'] } },
    );
    return result;
  },
  createCategory: async (name) => {
    const newCat = await model.Category.create(name);
    return newCat;
  },
  findAllCategories: async () => {
    const result = await model.Category.findAll();
    const mapped = result.map((user) => user.dataValues);
    return mapped;
  },
};

module.exports = services;
