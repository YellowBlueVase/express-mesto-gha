/* eslint-disable no-useless-escape */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

Joi.objectId = require('joi-objectid')(Joi);

const celebrateUser = {
  body: Joi.object().keys({
    _id: Joi.objectId(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
};

router.get('/cards', getCards);

router.post('/cards', celebrate(celebrateUser), auth, createCard);

router.delete('/cards/:cardId', celebrate(celebrateUser), auth, deleteCard);

router.put('/cards/:cardId/likes', celebrate(celebrateUser), auth, likeCard);

router.delete('/cards/:cardId/likes', celebrate(celebrateUser), auth, dislikeCard);

module.exports = router;
