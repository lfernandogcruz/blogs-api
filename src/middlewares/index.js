const middlewares = {
  tokenValidation: async (req, res, next) => {
    const { authorization } = req.headers;
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
