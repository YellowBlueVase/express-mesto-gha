const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const auth = require('./middlewares/auth');

// подключаемся к серверу mongo

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', routerUsers);
app.use(auth);
app.use('/', routerCards);
app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
});
