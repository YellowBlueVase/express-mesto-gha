/* eslint-disable consistent-return */
require('dotenv').config();
const jwt = require('jsonwebtoken');
const ERROR_CODE_401 = require('./error401');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
//   const token = req.cookie;
//   if (!token) {
//     next;
//     return;
//   }
//   let payload;
//   try {
//     payload = jwt.verify(token, 'some-secret-key');
//   }
//   catch (next)
// }

  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ERROR_CODE_401('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new ERROR_CODE_401('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
