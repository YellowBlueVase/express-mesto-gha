module.exports = (err, req, res, next) => {
  const { statusCode, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      output: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
};