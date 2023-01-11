/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

// Bad request
const ERROR_CODE_400 = require('../middlewares/error400');
// Not Found
const ERROR_CODE_404 = require('../middlewares/error404');

const opts = {
  new: true,
  runValidators: true,
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new ERROR_CODE_400('Переданы некорректные данные при создании пользователя.');
      }
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new ERROR_CODE_400('Переданы некорректные данные при создании пользователя.');
      }
      res.send({ data: users });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new ERROR_CODE_404('Пользователь по указанному _id не найден.');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.getProfile = (req, res, next) => {
  User.findById(req.params.me)
    .then((user) => {
      if (!user) {
        throw new ERROR_CODE_404('Пользователь по указанному _id не найден.');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 12)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      if (!user) {
        throw new ERROR_CODE_404('Пользователь по указанному _id не найден.');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.params.me,
    { name, about },
    opts,
  )
    .then((user) => {
      if (!user) {
        throw new ERROR_CODE_404('Пользователь по указанному _id не найден.');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.params.userId,
    { new: true },
    opts,
  )
    .then((user) => {
      if (!user) {
        throw new ERROR_CODE_404('Пользователь по указанному _id не найден.');
      }
      res.send({ data: user });
    })
    .catch(next);
};
