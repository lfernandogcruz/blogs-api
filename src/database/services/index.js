// const Sequelize = require('sequelize');

// const config = require('../config/config');

// const sequelize = new Sequelize(config.development);

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
    const result = await model.User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    return result;
  },
  createCategory: async (name) => {
    const newCat = await model.Category.create(name);
    return newCat;
  },
  findAllCategories: async () => {
    const result = await model.Category.findAll();
    const mapped = result.map((cat) => cat.dataValues);
    return mapped;
  },
  createPost: async (reqObj) => {
    const t = await model.sequelize.transaction();
    try {
      const today = Date.now();
      const newObj = { ...reqObj, published: today, updated: today };
      const blogPost = await model.BlogPost.create(newObj, { transaction: t });
      await Promise.all(
        reqObj.categoryIds.map((id) => {
          const postCat = model.PostCategory.create({ postId: blogPost.id, categoryId: id },
            { transaction: t });
            return postCat;
        }),
      );
      t.commit();
      return blogPost;
    } catch (e) {
      await t.rollback();
      console.log(e.message);
    }
  },
  findAllPost: async () => {
    const result = await model.BlogPost.findAll({
      include: [
        {
          model: model.User,
          as: 'user',
          attributes: { exclude: ['password'] },
        },
        {
          model: model.Category,
          as: 'categories',
          through: { attributes: [] },
        },
      ],
    });
    return result;
  },
  findByIdPost: async (id) => {
    const result = await model.BlogPost.findByPk(id, {
      include: [
        {
          model: model.User,
          as: 'user',
          attributes: { exclude: ['password'] },
        },
        {
          model: model.Category,
          as: 'categories',
          through: { attributes: [] },
        },
      ],
    });
    return result;
  },
};

module.exports = services;
