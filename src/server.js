require('dotenv').config();
const app = require('./api');
const controller = require('./database/controller');
const middleware = require('./database/middlewares');
const helpers = require('./database/helpers');

// não remova a variável `API_PORT` ou o `listen`
const port = process.env.API_PORT || 3000;

// não remova esse endpoint
app.get('/', (_request, response) => {
  response.send();
});

app.post('/login',
  middleware.loginEmptyFieldsValidation,
  middleware.loginValidation,
  controller.userLogin);
  
app.get('/user/:id',
  helpers.tokenAuth,
  controller.findByIdUser);
app.get('/user',
  helpers.tokenAuth,
  controller.findAllUser);
app.post('/user',
  middleware.validateDisplayName,
  middleware.validateEmail,
  middleware.validatePassword,
  middleware.validateUniqueEmail,
  controller.createUser);
app.delete('/user/me',
  helpers.tokenAuth,
  controller.slashUser);

app.get('/categories',
  helpers.tokenAuth,
  controller.findAllCategories);
app.post('/categories',
  helpers.tokenAuth,
  middleware.validateCatNameNotEmpty,
  controller.createCategory);

app.get('/post/search?',
  helpers.tokenAuth,
  controller.searchPost);
app.get('/post/:id',
  helpers.tokenAuth,
  controller.findByIdPost);
app.get('/post',
  helpers.tokenAuth,
  controller.findAllPost);
app.post('/post',
  helpers.tokenAuth,
  middleware.validatePostFieldsNotEmpty,
  middleware.validateExistingCategories,
  controller.createPost);
app.put('/post/:id',
  helpers.tokenAuth,
  middleware.validateExistingPostAndUserOwnership,
  middleware.validateFieldsFilledForUpdating,
  controller.updateByIdPost);
app.delete('/post/:id',
  helpers.tokenAuth,
  middleware.validateExistingPostAndUserOwnership,
  controller.slashByIdPost);

app.use((err, _req, res, _next) => {
  if (err.message === 'connect ECONNREFUSED 127.0.0.1:3306') {
    return res.status(500).json({ message: 'DB OFFLINE' });
  }
  if (err.message === 'connect ECONNREFUSED 127.0.0.1:3300') {
    return res.status(500).json({ message: 'DB OFFLINE' });
  }
  if (err.message === 'connect ECONNREFUSED 127.0.0.1:3030') {
    return res.status(500).json({ message: 'DB OFFLINE' });
  }
  return res.status(500).json({ message: 'Unknown ERROR' });
});

app.listen(port, () => console.log('ouvindo porta', port));
