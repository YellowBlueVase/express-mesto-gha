/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const Card = require('../models/cards');

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

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'Bad request') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else if (err.name === 'Internal Server Error') {
        return res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию.' });
      } else { return `${err.name} : ${err.message} `; }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send(err);
      } else if (err.name === 'Bad request') {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else if (err.name === 'Internal Server Error') {
        return res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию.' });
      } else { return `${err.name} : ${err.message} `; }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'Not Found') {
        res.status(ERROR_CODE_404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else { return `${err.name} : ${err.message} `; }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    opts,
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'Bad request') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else if (err.name === 'Not Found') {
        return res.status(ERROR_CODE_404).send({ message: 'Передан несуществующий _id карточки.' });
      } else if (err.name === 'Internal Server Error') {
        return res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию.' });
      } else { return `${err.name} : ${err.message} `; }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    opts,
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'Bad request') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else if (err.name === 'Not Found') {
        res.status(ERROR_CODE_404).send({ message: 'Передан несуществующий _id карточки.' });
      } else if (err.name === 'Internal Server Error') {
        res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию.' });
      } else { return `${err.name} : ${err.message} `; }
    });
};
