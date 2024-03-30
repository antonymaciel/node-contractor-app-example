const { ERROR_MESSAGES } = require('../constants');

const unexpectedErrorHandler = async (error, req, res, next) => {
  console.error(error);

  return res.status(500).send(ERROR_MESSAGES.internalError);
};

module.exports = { unexpectedErrorHandler };
