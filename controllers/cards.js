/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const Card = require('../models/cards');

// Bad request
const ERROR_CODE_400 = require('../middlewares/error400');
// Not Found
const ERROR_CODE_404 = require('../middlewares/error404');

const opts = {
  new: true,
  runValidators: true,
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new ERROR_CODE_400('Переданы некорректные данные при создании карточки.');
      }
      res.send({ data: cards });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => {
      if (!card) {
        throw new ERROR_CODE_400('Переданы некорректные данные при создании карточки.');
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        throw new ERROR_CODE_404('Карточка с указанным _id не найдена.');
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    opts,
  )
    .then((card) => {
      if (!card) {
        throw new ERROR_CODE_400('Переданы некорректные данные при создании карточки.');
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    opts,
  )
    .then((card) => {
      if (!card) {
        throw new ERROR_CODE_400('Переданы некорректные данные при создании карточки.');
      }
      res.send({ data: card });
    })
    .catch(next);
};
