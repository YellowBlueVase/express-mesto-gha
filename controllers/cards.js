/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const Card = require('../models/cards');

// Bad request
const ERROR_CODE_400 = 400;
// Not Found
const ERROR_CODE_404 = 404;
// Internal Server Error
const ERROR_CODE_500 = 500;

const opts = { runValidators: true };

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'Bad request') { return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании карточки.' }); }
      if (err.name === 'Internal Server Error') { return res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию.' }); }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') { res.status(ERROR_CODE_400).send(err); }
      if (err.name === 'Bad request') { return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании карточки.' }); }
      if (err.name === 'Internal Server Error') { return res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию.' }); }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'Not Found') { return res.status(ERROR_CODE_404).send({ message: 'Карточка с указанным _id не найдена.' }); }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
    opts,
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'Bad request') { return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' }); }
      if (err.name === 'Not Found') { return res.status(ERROR_CODE_404).send({ message: 'Передан несуществующий _id карточки.' }); }
      if (err.name === 'Internal Server Error') { return res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию.' }); }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
    opts,
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'Bad request') { return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' }); }
      if (err.name === 'Not Found') { return res.status(ERROR_CODE_404).send({ message: 'Передан несуществующий _id карточки.' }); }
      if (err.name === 'Internal Server Error') { return res.status(ERROR_CODE_500).send({ message: 'Ошибка по умолчанию.' }); }
    });
};
