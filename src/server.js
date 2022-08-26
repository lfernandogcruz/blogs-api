require('dotenv').config();
const app = require('./api');
const model = require('./database/models');
const middleware = require('./database/middlewares');
const controller = require('./database/controller');

// não remova a variável `API_PORT` ou o `listen`
const port = process.env.API_PORT || 3000;

// não remova esse endpoint
app.get('/', (_request, response) => {
  response.send();
});

app.get('/login', model.User);
app.post('/login',
  middleware.loginEmptyFieldsValidation,
  middleware.loginValidation,
  controller.userLogin);

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
