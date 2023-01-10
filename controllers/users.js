/* eslint-disable consistent-return */
const User = require('../models/users');

// Bad request
const ERROR_CODE_400 = 400;
// Not Found
const ERROR_CODE_404 = 404;
// Internal Server Error
const ERROR_CODE_500 = 500;

const opts = {
  new: true,
  runValidators: true,
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'Bad request') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else if (err.name === 'Internal Server Error') {
        return res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию.' });
      } else { return `${err.name} : ${err.message} `; }
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'Not Found') {
        res.status(ERROR_CODE_404).send({ message: 'Пользователь по указанному _id не найден.' });
      } else if (err.name === 'Internal Server Error') {
        return res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию.' });
      } else { return `${err.name} : ${err.message} `; }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send(err);
      } else if (err.name === 'Bad request') {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.name === 'Not Found') {
        return res.status(ERROR_CODE_404).send({ message: 'Пользователь с указанным _id не найден.' });
      } else if (err.name === 'Internal Server Error') {
        return res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию.' });
      } else { return `${err.name} : ${err.message} `; }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    opts,
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send(err);
      } else if (err.name === 'Bad request') {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.name === 'Not Found') {
        return res.status(ERROR_CODE_404).send({ message: 'Пользователь с указанным _id не найден.' });
      } else if (err.name === 'Internal Server Error') {
        return res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию.' });
      } else { return `${err.name} : ${err.message} `; }
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.params.userId,
    { new: true },
    opts,
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send(err);
      } else if (err.name === 'Bad request') {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else if (err.name === 'Not Found') {
        return res.status(ERROR_CODE_404).send({ message: 'Пользователь с указанным _id не найден.' });
      } else if (err.name === 'Internal Server Error') {
        return res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию.' });
      } else { return `${err.name} : ${err.message} `; }
    });
};
